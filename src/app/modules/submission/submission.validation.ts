import z from "zod";

const createSubmissionSchema = z.object({
    projectName: z
        .string()
        .trim()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name cannot exceed 100 characters"),

    repoUrl: z
        .string()
        .trim()
        .url("Please provide a valid repository URL")
        .refine(
            (value) => ["http:", "https:"].includes(new URL(value).protocol),
            "Repository URL must use HTTP or HTTPS",
        ),

    liveUrl: z
        .string()
        .trim()
        .url("Please provide a valid live project URL")
        .refine(
            (value) => ["http:", "https:"].includes(new URL(value).protocol),
            "Live project URL must use HTTP or HTTPS",
        ),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description cannot exceed 2000 characters"),
});

const submissionQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
});

const reviewSubmissionSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    comment: z
        .string()
        .trim()
        .min(3, "Review comment must be at least 3 characters")
        .max(1000, "Review comment cannot exceed 1000 characters"),
});

export const submissionValidation = {
    createSubmissionSchema,
    submissionQuerySchema,
    reviewSubmissionSchema,
}