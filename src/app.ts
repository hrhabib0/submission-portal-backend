
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AuthRoutes } from "./app/modules/auth/auth.route.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());


// modules route
app.use("/api/auth", AuthRoutes);

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Project Submission API is running",
    });
});

export default app;
