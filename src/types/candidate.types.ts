/**
 * Candidate status types
 */
export type CandidateStatus =
    | "RECEIVED"
    | "SHORTLISTED"
    | "TECHNICAL_INTERVIEW"
    | "HR_INTERVIEW"
    | "SELECTED"
    | "MEDICAL_VISIT"
    | "OFFER_SENT"
    | "HIRED"
    | "REJECTED";

/**
 * Candidate interface
 */
export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    positionAppliedFor?: string;
    status: CandidateStatus;
    resume?: string;
    coverLetter?: string;
    source?: string;
    appliedDate: string;
    documents?: string[];
}

/**
 * Create/Update candidate data
 */
export interface CandidateFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    status: CandidateStatus;
    source?: string;
    notes?: string;
}

/**
 * Candidate status history entry
 */
export interface StatusHistoryEntry {
    status: CandidateStatus;
    changedAt: string;
    changedBy: string;
    notes?: string;
}

/**
 * Status history response
 */
export interface StatusHistoryResponse {
    history: StatusHistoryEntry[];
}

/**
 * Paginated candidates response
 */
export interface CandidatesResponse {
    candidates: Candidate[];
    total: number;
    page: number;
    totalPages: number;
}
