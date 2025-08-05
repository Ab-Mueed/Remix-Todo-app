import { apiRequest, withAuth, API_ENDPOINTS } from "./api";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// Authentication service class
export class AuthService {
  // Login user and return tokens
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  // Get current user information
  static async getCurrentUser(token: string): Promise<User | null> {
    try {
      const response = await apiRequest<User>(API_ENDPOINTS.AUTH.ME, 
        withAuth(token, { method: "GET" })
      );
      return response.data;
    } catch (error) {
      // Silently return null for auth failures - this is expected behavior
      return null;
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<void> {
    await apiRequest(API_ENDPOINTS.USERS.CREATE, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }
} 