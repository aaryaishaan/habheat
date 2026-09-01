import { z } from "zod";

export const createHabitSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Habit name is required"),

    color: z
        .string()
        .optional(),

    startDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Start date must be in YYYY-MM-DD format"
        ),
});
export const updateHabitSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Habit name cannot be empty")
        .optional(),

    color: z
        .string()
        .optional(),
});

export const toggleHabitSchema = z.object({
    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        ),
});