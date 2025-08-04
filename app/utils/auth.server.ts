// extracts the access token from HttpOnly cookies on server
export function getAuthToken(request: Request): any {
  const cookieHeader = request.headers.get("cookie"); // cookies header from the http request
  console.log("Cookie header:", cookieHeader); // Debug log
  if (!cookieHeader) return null; // if no cookies, return null

  const accessTokenMatch = cookieHeader.match(/access_token=([^;]+)/); // regex to extract access token
  const token = accessTokenMatch ? accessTokenMatch[1] : null; // Either retun token value or null if not found

  console.log("Extracted token:", token ? "Found" : "Not found"); // Debug log
  return token;
}

// Using Token to get current user info
export async function getCurrentUser(request: Request) {
  // Get the token from getAuthToken function
  const token = getAuthToken(request);
  console.log("getCurrentUser - token:", token ? "exists" : "missing"); // Debug log
  if (!token) return null; // No token means not logged in

  try {
    // API call to directus to get current user info
    const response = await fetch("http://localhost:8055/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Users/me response status:", response.status); // Debug log

    // return user data if successful
    if (response.ok) {
      const userData = await response.json();
      console.log("userData:",userData)
      if (userData.data) {
        console.log("User data.data:", userData.data);
        return {
          id: userData.data.id,
          email: userData.data.email,
          first_name: userData.data.first_name,
          last_name: userData.data.last_name,
        };
      }
    }
    return null; // token is either invalid or expired
  } catch (error) {
    return null; // other issues
  }
}
