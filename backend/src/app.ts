import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import habitRouter from "./routes/habit.routes.js";
import taskRouter from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ENV } from "./config/env.js";
const app = express();


app.use(
    cors({
        origin: ENV.FRONTEND_URL,
        credentials: true,
    })
);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());


//ROUTES
app.use("/api/auth", authRouter)
app.use("/api/habits", habitRouter)
app.use("/api/tasks", taskRouter)

app.use(errorHandler);




export default app;