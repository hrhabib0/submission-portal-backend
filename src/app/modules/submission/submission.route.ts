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
    SubmissionController.createSubmission
)
router.get(
    "/",
    auth(Role.MENTOR, Role.ADMIN),
    validateRequest(submissionValidation.submissionQuerySchema),
    SubmissionController.getAllSubmissions
)
router.get(
    "/my-submissions",
    auth(Role.STUDENT),
    SubmissionController.getMySubmissions
)
router.get(
    "/stats",
    auth(Role.MENTOR, Role.ADMIN),
    SubmissionController.getSubmissionStats,
);
router.patch(
    "/:submissionId/review",
    auth(Role.MENTOR, Role.ADMIN),
    validateRequest(submissionValidation.reviewSubmissionSchema),
    SubmissionController.reviewSubmission,
);
router.get(
    "/:submissionId",
    auth(Role.MENTOR, Role.ADMIN),
    SubmissionController.getSubmissionById
)


export const SubmissionRoutes = router;