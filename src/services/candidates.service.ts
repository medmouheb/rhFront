import apiService from "./api.service";
import type {
    Candidate,
    CandidateFormData,
    CandidatesResponse,
    StatusHistoryResponse,
} from "@/types/candidate.types";

/**
 * Candidates Service for API interactions
 */
class CandidatesService {
    /**
     * Get paginated list of candidates
     */
    async getCandidates(params?: {
        page?: number;
        limit?: number;
        status?: string;
        position?: string;
        search?: string;
    }): Promise<CandidatesResponse> {
        const response = await apiService.getAxiosInstance().get<CandidatesResponse>(
            "/candidates",
            { params }
        );
        return response.data;
    }

    /**
     * Get candidate by ID
     */
    async getCandidateById(id: string): Promise<Candidate> {
        const response = await apiService.getAxiosInstance().get<Candidate>(
            `/candidates/${id}`
        );
        return response.data;
    }

    /**
     * Create new candidate
     */
    async createCandidate(data: CandidateFormData): Promise<Candidate> {
        const response = await apiService.getAxiosInstance().post<Candidate>(
            "/candidates",
            data
        );
        return response.data;
    }

    /**
     * Update candidate
     */
    async updateCandidate(id: string, data: Partial<CandidateFormData>): Promise<Candidate> {
        const response = await apiService.getAxiosInstance().put<Candidate>(
            `/candidates/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Delete candidate
     */
    async deleteCandidate(id: string): Promise<{ message: string }> {
        const response = await apiService.getAxiosInstance().delete<{ message: string }>(
            `/candidates/${id}`
        );
        return response.data;
    }

    /**
     * Get candidate status history
     */
    async getCandidateStatusHistory(id: string): Promise<StatusHistoryResponse> {
        const response = await apiService.getAxiosInstance().get<StatusHistoryResponse>(
            `/candidates/${id}/status-history`
        );
        return response.data;
    }

    /**
     * Upload candidate documents
     */
    async uploadCandidateDocuments(
        id: string,
        files: { cv?: File; documents?: File }
    ): Promise<{ cvUrl?: string; documentsUrl?: string; message: string }> {
        const formData = new FormData();
        if (files.cv) {
            formData.append("cv", files.cv);
        }
        if (files.documents) {
            formData.append("documents", files.documents);
        }

        const response = await apiService.getAxiosInstance().post(
            `/candidates/${id}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    }
}

export const candidatesService = new CandidatesService();
export default candidatesService;
