import { Router } from "express";
import { auth } from "../../middleware/checkAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { submissionValidation } from "./submission.validation.js";
import { SubmissionController } from "./submission.controller.js";


const router = Router();


router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(submissionValidation.createSubmissionSchema),
    SubmissionController.createSubmission
)



export const SubmissionRoutes = router;