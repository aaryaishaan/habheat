import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required"),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});


export const loginSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});


export const updateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name cannot be empty")
        .optional(),

    email: z
        .email("Invalid email address")
        .optional(),
}).refine(
    (data) => data.name !== undefined || data.email !== undefined,
    {
        message: "Nothing to update",
    }
);