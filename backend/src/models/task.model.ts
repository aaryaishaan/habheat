import mongoose from "mongoose";

interface ITask {
    userId: mongoose.Types.ObjectId;
    title: string;
    completed: boolean;
    date: string;
}

const taskSchema = new mongoose.Schema<ITask>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        date: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);