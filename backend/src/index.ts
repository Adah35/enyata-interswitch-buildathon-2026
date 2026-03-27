import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { Application } from "express";
import { AppDataSource } from "./connection/data-source";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { allowedOrigins, config } from "./config";
import { Express, Request, Response } from "express";
import errorHandler from "./middleware/errorHandler";
import { NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { rootRoute } from "./routes/index";
import { connectRedis } from "./utils/redis";
import { UserRole } from "./entities/enums";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      isEmailVerified?: boolean;
      isActive?: boolean;
    };
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
  }
}

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully");

    await connectRedis();

    const app = express();
    const httpServer = createServer(app);

    app.use(helmet());

    app.use(express.json({ limit: "1mb" }));
    app.use(cookieParser());

    // CORS
    const corsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    };
    app.use(cors(corsOptions));

    // Global rate limiter 
    app.use(
      rateLimit({
        windowMs: 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );

    // Routes
    routes(app);

    const port = parseInt(config.PORT, 10);
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port} [${config.NODE_ENV}]`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

const routes = (app: Application) => {
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/v1", rootRoute);

  // 404 fallback
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });

  app.use(errorHandler);
};