import { Router } from "express";

import {
    getMe,
    loginUser,
    logoutUser,
    registerUser,
    updateUser
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validation.middleware.js";

import {
    registerSchema,
    loginSchema,
    updateUserSchema
} from "../validators/auth.validator.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    registerUser
);

router.post(
    "/login",
    validate(loginSchema),
    loginUser
);

router.post(
    "/logout",
    logoutUser
);

router.patch(
    "/update",
    protectRoute,
    validate(updateUserSchema),
    updateUser
);

router.get(
    "/me",
    protectRoute,
    getMe
);

export default router;