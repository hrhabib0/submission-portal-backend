import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", validateRequest(authValidation.registerSchema), AuthController.registerUser);
router.post("/login", validateRequest(authValidation.loginSchema), AuthController.loginUser);


export const AuthRoutes = router;