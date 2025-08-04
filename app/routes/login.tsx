import { Form, href, redirect, type ActionFunctionArgs } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { getCurrentUser } from "~/utils/auth.server";

// For showing todos menu if user is already logged in, since user can do this localhost:8055/login and there we will
// check if user is already authenticated then we dont need to ask him to login again
export async function loader({ request }: { request: Request }) {
  console.log("login loader function");
  const user = await getCurrentUser(request);
  if (user) {
    return redirect(href("/"));
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("login clicked");
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch("http://localhost:8055/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", res.status); // Debug log

    if (res.ok) {
      const data = await res.json();
      console.log("Login successful, redirecting..."); // Debug log

      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        `access_token=${data.data.access_token}; HttpOnly; Path=/`
      );
      headers.append(
        "Set-Cookie",
        `refresh_token=${data.data.refresh_token}; HttpOnly; Path=/`
      );
      return redirect(href("/"), {
        headers,
      });
    } else {
      throw new Error("Login Failed");
    }
  } catch (err: any) {
    console.log(err.message, "status:401");
  }
}

export default function LoginPage({ actionData }: any) {
  const { email, setEmail, password, setPassword } = useAuth();

  return (
    <main className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
      <h1>Login</h1>
      <Form method="POST" className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded hover:bg-blue-700 font-medium text-sm sm:text-base"
        >
          Login
        </button>
      </Form>
    </main>
  );
}
