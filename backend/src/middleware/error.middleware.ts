import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(error);

    // Zod validation error
    if (error instanceof ZodError) {
        res.status(400).json({
            message: "Validation failed",
            errors: error.issues,
        });

        return;
    }

    // Mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            message: "Database validation failed",
            errors: Object.values(error.errors).map((err) => err.message),
        });

        return;
    }

    // Invalid MongoDB ObjectId
    if (error instanceof mongoose.Error.CastError) {
        res.status(400).json({
            message: "Invalid ID",
        });

        return;
    }

    // MongoDB duplicate key error
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    ) {
        res.status(409).json({
            message: "Duplicate value already exists",
        });

        return;
    }

    // Unknown / unexpected error
    res.status(500).json({
        message: "Internal server error",
    });
};