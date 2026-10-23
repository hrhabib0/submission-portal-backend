import { SubmissionStatus } from "../../../generated/prisma/enums.js";

export interface ICreateSubmissionPayload {
    projectName: string;
    repoUrl: string;
    liveUrl: string;
    description: string;
}

export interface ISubmissionListQuery {
    page: number;
    limit: number;
    status?: SubmissionStatus;
}

export interface IReviewSubmissionPayload {
    status: "APPROVED" | "REJECTED";
    comment: string;
}