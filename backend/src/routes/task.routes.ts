import { Router } from "express";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createTaskSchema,
    updateTaskSchema,
} from "../validators/task.validator.js";

const router = Router();

router.post(
    "/",
    protectRoute,
    validate(createTaskSchema),
    createTask
);

router.get(
    "/",
    protectRoute,
    getTasks
);

router.get(
    "/:id",
    protectRoute,
    getTaskById
);

router.patch(
    "/:id",
    protectRoute,
    validate(updateTaskSchema),
    updateTask
);

router.delete(
    "/:id",
    protectRoute,
    deleteTask
);

export default router;

// ishaan3@email.com's task id =>  6a96e0fde74b43d15c74d9a2