/**
 * Hiring request types
 */
export type HiringRequestPriority = "Low" | "Medium" | "High" | "Urgent";
export type HiringRequestStatus =
    | "Draft"
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Fulfilled";

/**
 * Hiring Request interface
 */
export interface HiringRequest {
    id: string;
    position: string;
    department: string;
    numberOfPositions: number;
    description: string;
    requirements: string;
    priority: HiringRequestPriority;
    deadline: string;
    budget?: number;
    status: HiringRequestStatus;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Create/Update hiring request data
 */
export interface HiringRequestFormData {
    position: string;
    department: string;
    numberOfPositions: number;
    description: string;
    requirements: string;
    priority: HiringRequestPriority;
    deadline: string;
    budget?: number;
    status: HiringRequestStatus;
}

/**
 * Paginated hiring requests response
 */
export interface HiringRequestsResponse {
    requests: HiringRequest[];
    total: number;
    page: number;
    totalPages: number;
}
