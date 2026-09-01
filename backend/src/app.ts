import express from "express";
import healthRouter from "../src/routes/health.routes.js"
import authRouter from "../src/routes/auth.routes.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded());


app.use("/api/health", healthRouter)

//AUTH APIS
app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
  res.json({
    message: "HABHEAT API is running"
  });
});

export default app;