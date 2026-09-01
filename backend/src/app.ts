import express from "express";
import cookieParser from "cookie-parser";
import healthRouter from "../src/routes/health.routes.js"
import authRouter from "./routes/auth.routes.js"
import habitRouter from "../src/routes/habit.routes.js"
const app = express();


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());


app.use("/api/health", healthRouter)

//AUTH ROUTE
app.use("/api/auth", authRouter)

//HABIT ROUTE
app.use("/api/habits", habitRouter)

//health route

app.get("/", (req, res) => {
  res.json({
    message: "HABHEAT API is running"
  });
});

export default app;