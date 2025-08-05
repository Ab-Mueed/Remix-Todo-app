import { AuthService } from "~/services/auth.service";

// Extracts the access token from HttpOnly cookies on server
export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const accessTokenMatch = cookieHeader.match(/access_token=([^;]+)/);
  return accessTokenMatch ? accessTokenMatch[1] : null;
}

// Get current user information using the auth token
export async function getCurrentUser(request: Request) {
  const token = getAuthToken(request);
  if (!token) return null;

  try {
    return await AuthService.getCurrentUser(token);
  } catch (error) {
    return null;
  }
}
