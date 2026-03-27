"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const root_1 = __importDefault(require("../errors/root"));
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    // TypeORM: Entity not found
    if (err instanceof typeorm_1.EntityNotFoundError) {
        return res.status(404).json({
            success: false,
            message: "Resource not found",
            error: err.message,
            stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    }
    // TypeORM: Query failed
    if (err instanceof typeorm_1.QueryFailedError) {
        // Unique constraint violation (23505)
        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Unique constraint violation",
                error: "This record already exists",
                detail: err.detail,
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
        // Not-null constraint violation (23502)
        if (err.code === "23502") {
            return res.status(400).json({
                success: false,
                message: "Not-null constraint violation",
                error: "Required field is missing",
                detail: err.detail,
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
        // Foreign key constraint violation (23503)
        if (err.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Foreign key constraint violation",
                error: "Referenced record does not exist",
                detail: err.detail,
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
        // Invalid UUID format (22P02)
        if (err.code === "22P02") {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format",
                error: err.message,
                detail: err.detail,
                stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
        // Generic database error
        return res.status(400).json({
            success: false,
            message: "Database query failed",
            error: err.message,
            detail: err.detail,
            stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    }
    // Custom HttpException
    if (err instanceof root_1.default) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            errors: err.errors,
            stack: process.env.NODE_ENV === "production" ? null : err.stack,
        });
    }
    // Default fallback
    const status = res.statusCode !== 200 ? res.statusCode : 500;
    return res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
        status,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map