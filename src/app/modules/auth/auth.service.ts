import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { IRegisterUserPayload } from "./auth.interface.js"
import config from "../../config/index.js";
import { AppError } from "../../errors/AppError.js";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt.js";
import { SignOptions } from "jsonwebtoken";

const registerUser = async (payload: IRegisterUserPayload) => {
    const { name, email, password } = payload;

    // step 1: check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists.");
    }

    // step 2: hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    // step 3: return the created user
    return { user };
}

const loginUser = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;
    // 1. Find user 
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    // 2. Check whether account is active 
    if (!user.isActive) {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is inactive",);
    }

    // 3. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    // 4. Create access token
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions["expiresIn"]
    )
    // 5. Create refresh token
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions["expiresIn"]
    )
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}

export const AuthServices = {
    registerUser,
    loginUser,
}