import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authValidation } from "./auth.validation.js";
import { auth } from "../../middleware/checkAuth.js";

const router = Router();

router.post("/register", validateRequest(authValidation.registerSchema), AuthController.registerUser);
router.post("/login", validateRequest(authValidation.loginSchema), AuthController.loginUser);
router.get("/me", auth(), AuthController.getMe);
router.post("/logout", AuthController.logoutUser);


export const AuthRoutes = router;