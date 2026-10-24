import { Request, Response } from "express";
import config from "../../config/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req, res) => {
    const result = await AuthServices.registerUser(req.body);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: result
    })
})

const loginUser = catchAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await AuthServices.loginUser(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: user
    })
})

const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId!
    const result = await AuthServices.getMe(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile retrieved successfully",
        data: result,
    })
});

const logoutUser = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        path: "/",
    });

    res.status(httpStatus.OK).json({
        success: true,
        message: "Logout successful",
    });
});

export const AuthController = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
}