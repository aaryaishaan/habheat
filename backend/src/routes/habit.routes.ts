import { Router } from "express";
import { validate } from "../middleware/validation.middleware.js";
import { createHabitSchema, toggleHabitSchema, updateHabitSchema } from "../validators/habit.validator.js";

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

router.post("/", protectRoute, validate(createHabitSchema) ,createHabit);

router.get("/", protectRoute, getHabits);

router.get("/:id", protectRoute, getHabitById);

router.patch("/:id", protectRoute, validate(updateHabitSchema) ,updateHabit);

router.delete("/:id", protectRoute, deleteHabit);

router.patch("/:id/toggle", protectRoute, validate(toggleHabitSchema) ,toggleHabit);

export default router;