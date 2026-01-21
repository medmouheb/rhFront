/**
 * User role types for role-based access control
 */
export type UserRole = "RH" | "Manager" | "CO" | "Directeur";

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  username: string;
  role: UserRole;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * API response for authentication endpoints
 */
export interface AuthResponse {
  user: User;
  message: string;
}

/**
 * API response for current user endpoint
 */
export interface CurrentUserResponse {
  user: User;
}
