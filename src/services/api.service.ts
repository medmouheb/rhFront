import axios, { AxiosInstance, AxiosError } from "axios";
import type {
    LoginCredentials,
    AuthResponse,
    CurrentUserResponse
} from "@/types/user.types";

/**
 * API Service class for handling all HTTP requests
 */
class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
            withCredentials: true, // Enable HTTP-only cookies
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                // Handle 401 Unauthorized - redirect to login
                if (error.response?.status === 401) {
                    // Only redirect if we're in the browser (not during SSR)
                    // and not already on an auth page
                    if (typeof window !== "undefined") {
                        const isOnAuthPage = window.location.pathname.startsWith("/auth/");
                        if (!isOnAuthPage) {
                            window.location.href = "/auth/sign-in";
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get axios instance for custom requests
     */
    getAxiosInstance(): AxiosInstance {
        return this.api;
    }

    // ==================== Authentication Endpoints ====================

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.api.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    }

    /**
     * Logout current user
     */
    async logout(): Promise<{ message: string }> {
        const response = await this.api.post<{ message: string }>("/auth/logout");
        return response.data;
    }

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<CurrentUserResponse> {
        const response = await this.api.get<CurrentUserResponse>("/auth/me");
        return response.data;
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
