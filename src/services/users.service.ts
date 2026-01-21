import apiService from "./api.service";
import type { User } from "@/types/user.types";

/**
 * Users response interface
 */
export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Create/Update user data
 */
export interface UserFormData {
    username: string;
    password?: string;
    role: "RH" | "Manager" | "CO" | "Directeur";
}

/**
 * Users Service for API interactions (RH only)
 */
class UsersService {
    /**
     * Get paginated list of users
     */
    async getUsers(params?: {
        page?: number;
        limit?: number;
        role?: string;
    }): Promise<UsersResponse> {
        const response = await apiService.getAxiosInstance().get<UsersResponse>(
            "/users",
            { params }
        );
        return response.data;
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        const response = await apiService.getAxiosInstance().get<User>(
            `/users/${id}`
        );
        return response.data;
    }

    /**
     * Create new user
     */
    async createUser(data: UserFormData): Promise<User> {
        const response = await apiService.getAxiosInstance().post<User>(
            "/users",
            data
        );
        return response.data;
    }

    /**
     * Update user
     */
    async updateUser(id: string, data: Partial<UserFormData>): Promise<User> {
        const response = await apiService.getAxiosInstance().put<User>(
            `/users/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<{ message: string }> {
        const response = await apiService.getAxiosInstance().delete<{ message: string }>(
            `/users/${id}`
        );
        return response.data;
    }
}

export const usersService = new UsersService();
export default usersService;
