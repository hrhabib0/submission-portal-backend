import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { SubmissionServices } from "./submission.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError.js";
import { ISubmissionListQuery } from "./submission.interface.js";
import { submissionValidation } from "./submission.validation.js";


const createSubmission = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    if (!userId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Authentication required",
        );
    }

    const result = await SubmissionServices.createSubmission(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your submission created successfully",
        data: result,
    });
})

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
    const query = submissionValidation.submissionQuerySchema.parse(req.query);
    const result = await SubmissionServices.getAllSubmissions(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All submissions retrieved successfully",
        data: result,
    });
});

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await SubmissionServices.getMySubmissions(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your submissions retrieved successfully",
        data: result,
    });
})


export const SubmissionController = {
    createSubmission,
    getAllSubmissions,
    getMySubmissions,
}