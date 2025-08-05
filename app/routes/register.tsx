import { Form, redirect, href, Link, type ActionFunctionArgs } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { AuthService } from "~/services/auth.service";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  if (!email || !password || !first_name || !last_name) {
    return {
      error: "All fields are required",
    };
  }

  try {
    await AuthService.register({
      email,
      password,
      first_name,
      last_name,
    });

    return redirect(href("/login"));
  } catch (error) {
    return {
      error: "Registration failed. Please try again.",
    };
  }
}

export default function RegisterPage({ actionData }: any) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
  } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-semibold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-600">Join us to get started</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 sm:p-8">
          <Form method="POST" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="first_name"
                name="first_name"
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                id="last_name"
                name="last_name"
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" fullWidth size="lg">
              Create Account
            </Button>
          </Form>

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
              Already have an account?{" "}
              <Link to={href("/login")} className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
