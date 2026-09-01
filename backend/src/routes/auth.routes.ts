 import { Router } from "express";
import { getMe, loginUser, logoutUser, registerUser, updateUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
 const router = Router()

 router.post("/register", registerUser)
 router.post("/login", loginUser)
 router.post("/logout", logoutUser)

 router.patch("/update", protectRoute, updateUser)
 router.get("/me", protectRoute, getMe)

 export default router;