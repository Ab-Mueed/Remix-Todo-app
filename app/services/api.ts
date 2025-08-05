// API config and helper functions
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8055";

export interface ApiResponse<T = any> {
  data: T;
  meta?: any;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Main API request function - handles auth, errors, etc.
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

    // Some endpoints return empty bodies (201, 204, etc.)
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');

    if (response.status === 201 || response.status === 204 || !hasJsonContent) {
      return { data: null };
    }

    // Parse response text first to avoid JSON errors on empty responses
    const text = await response.text();
    if (!text.trim()) {
      return { data: null };
    }

    const responseData = JSON.parse(text);

    // Directus wraps everything in { data: ..., meta: ... }
    // but sometimes we get direct responses
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData;
    }

    // Wrap direct responses to match our expected format
    return { data: responseData };
  } catch (error) {
    // Don't spam console with auth failures - those are expected
    if (!(error instanceof Error) || 
        (!error.message.includes('401') && !error.message.includes('403'))) {
      console.error(`API request failed for ${endpoint}:`, error);
    }
    throw error;
  }
}

// Add Bearer token to request headers
export function withAuth(token: string, options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}

// All our API endpoints in one place
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