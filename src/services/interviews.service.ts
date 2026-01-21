import apiService from "./api.service";
import type {
    Interview,
    InterviewFormData,
    InterviewsResponse,
} from "@/types/interview.types";

/**
 * Interviews Service for API interactions
 */
class InterviewsService {
    /**
     * Get paginated list of interviews
     */
    async getInterviews(params?: {
        page?: number;
        limit?: number;
        status?: string;
        candidateId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<InterviewsResponse> {
        const response = await apiService.getAxiosInstance().get<InterviewsResponse>(
            "/interviews",
            { params }
        );
        return response.data;
    }

    /**
     * Get interview by ID
     */
    async getInterviewById(id: string): Promise<Interview> {
        const response = await apiService.getAxiosInstance().get<Interview>(
            `/interviews/${id}`
        );
        return response.data;
    }

    /**
     * Create new interview
     */
    async createInterview(data: InterviewFormData): Promise<Interview> {
        const response = await apiService.getAxiosInstance().post<Interview>(
            "/interviews",
            data
        );
        return response.data;
    }

    /**
     * Update interview
     */
    async updateInterview(
        id: string,
        data: Partial<InterviewFormData>
    ): Promise<Interview> {
        const response = await apiService.getAxiosInstance().put<Interview>(
            `/interviews/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Delete interview
     */
    async deleteInterview(id: string): Promise<{ message: string }> {
        const response = await apiService.getAxiosInstance().delete<{ message: string }>(
            `/interviews/${id}`
        );
        return response.data;
    }
}

export const interviewsService = new InterviewsService();
export default interviewsService;
