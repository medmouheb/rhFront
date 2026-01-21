/**
 * Interview types
 */
export type InterviewStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";

/**
 * Interview interface
 */
export interface Interview {
    id: string;
    candidateId: string;
    candidateName?: string;
    hiringRequestId: string;
    position?: string;
    interviewDate: string;
    duration: number; // in minutes
    location: string;
    interviewers: string[];
    status: InterviewStatus;
    notes?: string;
    feedbackSubmitted?: boolean;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Create/Update interview data
 */
export interface InterviewFormData {
    candidateId: string;
    hiringRequestId: string;
    interviewDate: string;
    duration: number;
    location: string;
    interviewers: string[];
    status: InterviewStatus;
    notes?: string;
}

/**
 * Paginated interviews response
 */
export interface InterviewsResponse {
    interviews: Interview[];
    total: number;
    page: number;
    totalPages: number;
}
