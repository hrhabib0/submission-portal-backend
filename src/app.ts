
import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Project Submission API is running",
    });
});

export default app;
