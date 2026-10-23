import config from "../../config/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req, res) => {
    const result = await AuthServices.registerUser(req.body);
    console.log("result", result);
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

export const AuthController = {
    registerUser,
    loginUser,
}