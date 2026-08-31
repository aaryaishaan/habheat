import mongoose from "mongoose";

interface ITask {
    userId: mongoose.Types.ObjectId;
    title: string;
    date: string;
    completed: boolean;

}

const taskSchema = new mongoose.Schema<ITask>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,

    },

    title : {
        type: String,
        required: true,
        trim: true,
    },
    date :{
        type: String,
        required: true,

    },
    completed:{
        type: Boolean,
        default: false,
    }
})

export const Task = mongoose.model<ITask>("Task", taskSchema);