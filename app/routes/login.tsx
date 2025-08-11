import { Form, href, redirect, Link, type ActionFunctionArgs } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { getCurrentUser } from "~/utils/auth.server";
import { AuthService } from "~/services/auth.service";
import { Box, Container, Stack, Text, Paper, Avatar, Alert, Anchor, Center } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
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
    <Box style={{ minHeight: '100vh' }} bg="gray.0">
      <Center h="100vh">
        <Container size="xs" w="100%">
          {/* Header */}
          <Stack align="center" mb="xl">
            <Avatar
              size="lg"
              radius="xl"
              color="blue"
              variant="filled"
            >
              T
            </Avatar>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={700} c="black">Welcome back</Text>
              <Text size="sm" c="gray.7">Sign in to your account</Text>
            </Stack>
          </Stack>

          {/* Form */}
          <Paper shadow="md" radius="md" bg="white" p="xl">
            <Form method="POST">
              <Stack gap="lg">
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
                <Button fullWidth size="lg" type="submit">
                  Sign In
                </Button>
              </Stack>
            </Form>

            {justRegistered && (
              <Alert
                icon={<IconCheck size={16} />}
                title="Success"
                color="teal"
                variant="light"
                radius="md"
                mt="lg"
              >
                Account created successfully! Please sign in.
              </Alert>
            )}

            {actionData?.error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                variant="light"
                radius="md"
                mt="lg"
              >
                {actionData.error}
              </Alert>
            )}

            <Text ta="center" mt="lg" size="sm" c="gray.7">
              Don't have an account?{" "}
              <Anchor component={Link} to={href("/register")} fw={500}>
                Sign up
              </Anchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
