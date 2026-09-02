import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Task title is required"),

    completed: z
        .boolean()
        .optional(),

    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        ),
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

    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        )
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