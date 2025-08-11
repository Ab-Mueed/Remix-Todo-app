import { Form, redirect, href, Link, type ActionFunctionArgs } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { Box, Container, Stack, Text, Paper, Avatar, Alert, Anchor, Center, SimpleGrid } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
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

    return redirect("/login?registered=true");
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
              <Text size="xl" fw={700} c="black">Create account</Text>
              <Text size="sm" c="gray.7">Join us to get started</Text>
            </Stack>
          </Stack>

          {/* Form */}
          <Paper shadow="md" radius="md" bg="white" p="xl">
            <Form method="POST">
              <Stack gap="lg">
                <SimpleGrid cols={2} spacing="md">
                  <Input
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth={false}
                  />
                  <Input
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth={false}
                  />
                </SimpleGrid>

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

                <Button fullWidth size="lg" type="submit">
                  Create Account
                </Button>
              </Stack>
            </Form>

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
              Already have an account?{" "}
              <Anchor component={Link} to={href("/login")} fw={500}>
                Sign in
              </Anchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
