import { Prisma } from "../../../generated/prisma/client.js";
import { AppError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateSubmissionPayload, ISubmissionListQuery } from "./submission.interface.js";
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

const getAllSubmissions = async (query: ISubmissionListQuery) => {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const status = query.status;
    const skip = (page - 1) * limit;

    const where: Prisma.SubmissionWhereInput = status ? { status } : {};

    const [submissions, total] = await prisma.$transaction([
        prisma.submission.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                feedback: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        comment: true,
                        createdAt: true,
                        mentor: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.submission.count({ where }),
    ]);
    return {
        data: submissions,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getMySubmissions = async (studentId: string) => {
    const submissions = await prisma.submission.findMany({
        where: { studentId },
        include: {
            feedback: {
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    comment: true,
                    createdAt: true,
                    mentor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!submissions) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "You have not submitted a project yet",
        );
    }

    return { submissions };
};

export const SubmissionServices = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
};