import { Form, href, redirect, type ActionFunctionArgs } from "react-router";
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
  return null;
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
    return {
      error: "Invalid email or password. Please try again.",
    };
  }
}

export default function LoginPage({ actionData }: any) {
  const { email, setEmail, password, setPassword } = useAuth();

  return (
    <main className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
      <h1>Login</h1>
      <Form method="POST" className="space-y-4 sm:space-y-5">
        <Input 
          type="email" 
          id="login-email"
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          label="Email" 
          required 
        />
        <Input 
          type="password" 
          id="login-password"
          name="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          label="Password" 
          required 
        />
        <Button type="submit" fullWidth>Login</Button>
      </Form>
      
      {actionData?.error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded text-sm">
          {actionData.error}
        </div>
      )}
    </main>
  );
}
