// Base API configuration and utilities
const API_BASE_URL = "http://localhost:8055";

export interface ApiResponse<T = any> {
  data: T;
  meta?: any;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Centralized fetch wrapper with authentication and error handling
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    // Handle empty responses (like 201 Created with no body)
    if (response.status === 201 || response.status === 204 || !hasJsonContent) {
      return { data: null };
    }

    // Try to parse JSON, handle empty responses gracefully
    const text = await response.text();
    if (!text.trim()) {
      return { data: null };
    }

    const responseData = JSON.parse(text);
    
    // Directus API returns { data: [...], meta: {...} } structure
    // We need to handle both the nested data structure and direct responses
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData;
    }
    
    // If it's not a Directus-style response, wrap it
    return { data: responseData };
  } catch (error) {
    // Only log unexpected errors, not authentication failures
    if (!(error instanceof Error) || !error.message.includes('401')) {
      console.error(`API request failed for ${endpoint}:`, error);
    }
    throw error;
  }
}

// Helper to add auth token to requests
export function withAuth(token: string, options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}

// Export API endpoints for consistency
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/users/me",
  },
  USERS: {
    CREATE: "/users",
  },
  TASKS: {
    LIST: "/items/tasks",
    CREATE: "/items/tasks",
    GET: (id: string | number) => `/items/tasks/${id}`,
    UPDATE: (id: string | number) => `/items/tasks/${id}`,
    DELETE: (id: string | number) => `/items/tasks/${id}`,
  },
} as const; 