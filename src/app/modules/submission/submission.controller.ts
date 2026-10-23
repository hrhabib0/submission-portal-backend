import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { submissionServices } from "./submission.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError.js";


const createSubmission = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    if (!userId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Authentication required",
        );
    }

    const result = await submissionServices.createSubmission(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your submission created successfully",
        data: result,
    });
})


export const SubmissionController = {
    createSubmission,
}