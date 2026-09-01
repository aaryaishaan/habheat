import { Router } from "express";

import {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit,
    toggleHabit,
} from "../controllers/habit.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protectRoute, createHabit);

router.get("/", protectRoute, getHabits);

router.get("/:id", protectRoute, getHabitById);

router.patch("/:id", protectRoute, updateHabit);

router.delete("/:id", protectRoute, deleteHabit);

router.patch("/:id/toggle", protectRoute, toggleHabit);

export default router;