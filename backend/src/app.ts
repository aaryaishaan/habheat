import express from "express";
import healthRouter from "../src/routes/health.routes.js"
const app = express();

app.use(express.json());
app.use("/api/health", healthRouter)

app.get("/", (req, res) => {
  res.json({
    message: "HABHEAT API is running"
  });
});

export default app;