"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
require("reflect-metadata");
const data_source_1 = require("./connection/data-source");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = require("./routes/index");
const redis_1 = require("./utils/redis");
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log("Database connected successfully");
    await (0, redis_1.connectRedis)();
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use((0, cookie_parser_1.default)());
    // CORS
    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin || config_1.allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    // Global rate limiter 
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    // Routes
    routes(app);
    const port = parseInt(config_1.config.PORT, 10);
    httpServer.listen(port, () => {
        console.log(`Server running on port ${port} [${config_1.config.NODE_ENV}]`);
    });
})
    .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
const routes = (app) => {
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    app.use("/api/v1", index_1.rootRoute);
    // 404 fallback
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: { code: "NOT_FOUND", message: "Route not found" },
        });
    });
    app.use(errorHandler_1.default);
};
//# sourceMappingURL=index.js.map