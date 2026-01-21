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
 * Response from GET /api/auth/me
 * Returns user object directly: {id, username, role}
 */
export type CurrentUserResponse = User;
