import { Prisma } from "../../../generated/prisma/client.js";
import { AppError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateSubmissionPayload } from "./submission.interface.js";
import httpStatus from "http-status";


const createSubmission = async (
    studentId: string,
    payload: ICreateSubmissionPayload,
) => {
    const existingSubmission = await prisma.submission.findUnique({
        where: { studentId },
    });

    if (existingSubmission) {
        throw new AppError(
            httpStatus.CONFLICT,
            "You have already submitted a project",
        );
    }

    try {
        const submission = await prisma.submission.create({
            data: {
                studentId,
                projectName: payload.projectName,
                repoUrl: payload.repoUrl,
                liveUrl: payload.liveUrl,
                description: payload.description,
            },
            select: {
                id: true,
                projectName: true,
                repoUrl: true,
                liveUrl: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return { submission };
    } catch (error: unknown) {
        // Handles concurrent requests for the same student.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new AppError(
                httpStatus.CONFLICT,
                "You have already submitted a project",
            );
        }

        throw error;
    }
};

const getAllSubmissions = async () => {
    const submissions = await prisma.submission.findMany({
        select: {
            id: true,
            studentId: true,
            projectName: true,
            repoUrl: true,
            liveUrl: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return { submissions };
};

const getMySubmissions = async (studentId: string) => {
    const submissions = await prisma.submission.findMany({
        where: { studentId },
        select: {
            id: true,
            projectName: true,
            repoUrl: true,
            liveUrl: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return { submissions };
};

export const SubmissionServices = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
};