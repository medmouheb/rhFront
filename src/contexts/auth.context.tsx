"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api.service";
import type { User, LoginCredentials, UserRole } from "@/types/user.types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    /**
     * Fetch current user from API
     */
    const refreshUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getCurrentUser();
            // Response is the user object directly: {id, username, role}
            // Normalize role to uppercase to match our types
            const normalizedUser = {
                ...response,
                role: response.role.toUpperCase() as UserRole,
            };

            setUser(normalizedUser);
        } catch (err: any) {
            // If not authenticated, clear user state
            setUser(null);
            // Don't redirect here - let the middleware handle it
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Login function
     */
    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.login(credentials);

            // Normalize role to uppercase to match our types
            const normalizedUser = {
                ...response.user,
                role: response.user.role.toUpperCase() as UserRole,
            };

            setUser(normalizedUser);

            // Role-based redirection
            switch (normalizedUser.role) {
                case "RH":
                    router.push("/dashboard/rh");
                    break;
                case "Manager":
                    router.push("/dashboard/manager");
                    break;
                case "CO":
                    router.push("/dashboard/co");
                    break;
                case "Directeur":
                    router.push("/dashboard/directeur");
                    break;
                default:
                    router.push("/");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout function
     */
    const logout = async () => {
        try {
            setLoading(true);
            await apiService.logout();
            setUser(null);
            router.push("/auth/sign-in");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
