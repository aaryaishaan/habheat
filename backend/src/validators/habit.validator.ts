import { z } from "zod";
import { dateSchema } from "./date.validator.js";

export const createHabitSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Habit name is required"),

    color: z
        .string()
        .optional(),

    startDate: dateSchema,
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
    date: dateSchema,
});