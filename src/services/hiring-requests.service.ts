import apiService from "./api.service";
import type {
    HiringRequest,
    HiringRequestFormData,
    HiringRequestsResponse,
} from "@/types/hiring-request.types";

/**
 * Hiring Requests Service for API interactions
 */
class HiringRequestsService {
    /**
     * Get paginated list of hiring requests
     */
    async getHiringRequests(params?: {
        page?: number;
        limit?: number;
        status?: string;
        department?: string;
        priority?: string;
    }): Promise<HiringRequestsResponse> {
        const response = await apiService.getAxiosInstance().get<HiringRequestsResponse>(
            "/hiring-requests",
            { params }
        );
        return response.data;
    }

    /**
     * Get hiring request by ID
     */
    async getHiringRequestById(id: string): Promise<HiringRequest> {
        const response = await apiService.getAxiosInstance().get<HiringRequest>(
            `/hiring-requests/${id}`
        );
        return response.data;
    }

    /**
     * Create new hiring request
     */
    async createHiringRequest(data: HiringRequestFormData): Promise<HiringRequest> {
        const response = await apiService.getAxiosInstance().post<HiringRequest>(
            "/hiring-requests",
            data
        );
        return response.data;
    }

    /**
     * Update hiring request
     */
    async updateHiringRequest(
        id: string,
        data: Partial<HiringRequestFormData>
    ): Promise<HiringRequest> {
        const response = await apiService.getAxiosInstance().put<HiringRequest>(
            `/hiring-requests/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Delete hiring request
     */
    async deleteHiringRequest(id: string): Promise<{ message: string }> {
        const response = await apiService.getAxiosInstance().delete<{ message: string }>(
            `/hiring-requests/${id}`
        );
        return response.data;
    }
}

export const hiringRequestsService = new HiringRequestsService();
export default hiringRequestsService;
