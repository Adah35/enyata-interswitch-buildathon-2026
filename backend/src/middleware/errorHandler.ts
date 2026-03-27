import { NextFunction, Request, Response } from "express";
import { QueryFailedError, EntityNotFoundError } from "typeorm";
import HttpException from "../errors/root";

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error("Error:", err);

	// TypeORM: Entity not found
	if (err instanceof EntityNotFoundError) {
		return res.status(404).json({
			success: false,
			message: "Resource not found",
			error: err.message,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	}

	// TypeORM: Query failed
	if (err instanceof QueryFailedError) {
		// Unique constraint violation (23505)
		if ((err as any).code === "23505") {
			return res.status(409).json({
				success: false,
				message: "Unique constraint violation",
				error: "This record already exists",
				detail: (err as any).detail,
				stack: process.env.NODE_ENV === "production" ? null : err.stack,
			});
		}

		// Not-null constraint violation (23502)
		if ((err as any).code === "23502") {
			return res.status(400).json({
				success: false,
				message: "Not-null constraint violation",
				error: "Required field is missing",
				detail: (err as any).detail,
				stack: process.env.NODE_ENV === "production" ? null : err.stack,
			});
		}

		// Foreign key constraint violation (23503)
		if ((err as any).code === "23503") {
			return res.status(409).json({
				success: false,
				message: "Foreign key constraint violation",
				error: "Referenced record does not exist",
				detail: (err as any).detail,
				stack: process.env.NODE_ENV === "production" ? null : err.stack,
			});
		}

		// Invalid UUID format (22P02)
		if ((err as any).code === "22P02") {
			return res.status(400).json({
				success: false,
				message: "Invalid UUID format",
				error: err.message,
				detail: (err as any).detail,
				stack: process.env.NODE_ENV === "production" ? null : err.stack,
			});
		}

		// Generic database error
		return res.status(400).json({
			success: false,
			message: "Database query failed",
			error: err.message,
			detail: (err as any).detail,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	}

	// Custom HttpException
	if (err instanceof HttpException) {
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

export default errorHandler;