import { z } from "zod";
import { dateSchema } from "./date.validator.js";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Task title is required"),

    completed: z
        .boolean()
        .optional(),

    date:dateSchema,
});


export const updateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Task title cannot be empty")
        .optional(),

    completed: z
        .boolean()
        .optional(),

    date: dateSchema
        .optional(),
}).refine(
    (data) =>
        data.title !== undefined ||
        data.completed !== undefined ||
        data.date !== undefined,
    {
        message: "Nothing to update",
    }
);