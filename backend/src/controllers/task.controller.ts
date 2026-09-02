import { Request, Response,NextFunction } from "express";
import { Task } from "../models/task.model.js";
import { nextTick } from "node:process";

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, completed, date } = req.body;

        const task = await Task.create({
            userId: req.userId,
            title,
            completed,
            date,
        });

        res.status(201).json({
            message: "Task created successfully",
            task,
        });

    } catch (error) {
        next(error);
    }
};

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const tasks = await Task.find({
            userId: req.userId,
        }).sort({ date: 1, createdAt: -1 });

        res.status(200).json({
            tasks,
        });

    } catch (error) {
       next(error)
    }
};

export const getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            userId: req.userId,
        });

        if (!task) {
            res.status(404).json({
                message: "Task not found",
            });

            return;
        }

        res.status(200).json({
            task,
        });

    } catch (error) {
       next(error)
    }
};

export const updateTask = async (
    req: Request,
    res: Response,
    next:NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;

        const { title, completed, date } = req.body;

        const task = await Task.findOne({
            _id: id,
            userId: req.userId,
        });

        if (!task) {
            res.status(404).json({
                message: "Task not found",
            });

            return;
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (completed !== undefined) {
            task.completed = completed;
        }

        if (date !== undefined) {
            task.date = date;
        }

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task,
        });

    } catch (error) {
        next(error)
    }
};
export const deleteTask = async (
    req: Request,
    res: Response,
    next:NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });

        if (!task) {
            res.status(404).json({
                message: "Task not found",
            });

            return;
        }

        res.status(200).json({
            message: "Task deleted successfully",
        });

    } catch (error) {
        next(error)
    }
};

