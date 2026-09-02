import { z } from "zod";

export const dateSchema = z
    .string()
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be in YYYY-MM-DD format"
    )
    .refine(
        (value) => {
            const [year, month, day] = value.split("-").map(Number);

            const date = new Date(year, month - 1, day);

            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        },
        {
            message: "Invalid date",
        }
    );