import { Form, href, redirect, Link, type ActionFunctionArgs } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { getCurrentUser } from "~/utils/auth.server";
import { AuthService } from "~/services/auth.service";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  if (user) {
    return redirect(href("/"));
  }

  // Check if user just registered
  const url = new URL(request.url);
  const justRegistered = url.searchParams.get('registered') === 'true';

  return { justRegistered };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  try {
    const loginData = await AuthService.login({ email, password });

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `access_token=${loginData.access_token}; HttpOnly; Path=/; SameSite=Strict`
    );
    headers.append(
      "Set-Cookie",
      `refresh_token=${loginData.refresh_token}; HttpOnly; Path=/; SameSite=Strict`
    );
    return redirect(href("/"), {
      headers,
    });
  } catch (error) {
    // Handle different types of authentication errors gracefully
    const errorMessage = error instanceof Error && error.message.includes('401')
      ? "Invalid email or password. Please try again."
      : "Login failed. Please check your connection and try again.";

    return {
      error: errorMessage,
    };
  }
}

export default function LoginPage({ actionData, loaderData }: any) {
  const { email, setEmail, password, setPassword } = useAuth();
  const { justRegistered } = loaderData || {};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-semibold text-lg">T</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-sm sm:text-base text-slate-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 sm:p-8">
          <Form method="POST" className="space-y-6">
            <Input
              type="email"
              id="login-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="Enter your email"
              required
            />
            <Input
              type="password"
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Enter your password"
              required
            />
            <Button type="submit" fullWidth size="lg">
              Sign In
            </Button>
          </Form>

          {justRegistered && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-emerald-700 font-medium">Account created successfully! Please sign in.</span>
              </div>
            </div>
          )}

          {actionData?.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{actionData.error}</span>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{" "}
              <Link to={href("/register")} className="text-slate-900 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
