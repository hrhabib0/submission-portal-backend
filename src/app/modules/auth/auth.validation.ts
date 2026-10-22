import { z } from "zod";

const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long"),
    email: z.string()
        .trim()
        .email("Please provide a valid email address")
        .transform((value) => value.toLowerCase()),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(72, "Password must be at most 72 characters long"),
});

const loginSchema = z.object({
    email: z.string()
        .trim()
        .email("Please provide a valid email address")
        .transform((value) => value.toLowerCase()),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(72, "Password must be at most 72 characters long"),
});

export const authValidation = {
    registerSchema,
    loginSchema,
};