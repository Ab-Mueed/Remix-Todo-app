import { Form, useLoaderData } from "react-router";
import { Box, Group, Text, Avatar, Stack } from "@mantine/core";
import Button from "./ui/Button";

export default function NavBar() {
  const loaderData = useLoaderData<{ user: any }>();

  if (!loaderData?.user) {
    return (
      <Box
        component="nav"
        bg="white"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
        px="xl"
        py="md"
      >
        <Group justify="space-between" w="100%">
          <Text c="gray.7">Loading...</Text>
        </Group>
      </Box>
    );
  }

  const { user } = loaderData;

  return (
    <Box
      component="nav"
      bg="white"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
      px="xl"
      py="md"
    >
      <Group justify="space-between" w="100%">
        {/* Left side - Logo */}
        <Group gap="sm">
          <Avatar
            size="md"
            radius="xl"
            color="blue"
            variant="filled"
          >
            T
          </Avatar>
          <Text size="lg" fw={600} c="black">TodoApp</Text>
        </Group>

        {/* Right side - User info and logout */}
        <Group gap="md">
          {/* User Info */}
          <Group
            gap="sm"
            bg="gray.0"
            style={{
              borderRadius: '9999px',
              padding: '8px 16px'
            }}
          >
            <Avatar
              size="sm"
              radius="xl"
              color="gray"
              variant="light"
            >
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </Avatar>
            <Box visibleFrom="sm">
              <Stack gap={0}>
                <Text size="xs" fw={500} c="black">
                  {user.first_name} {user.last_name}
                </Text>
                <Text size="xs" c="gray.6">
                  {user.email}
                </Text>
              </Stack>
            </Box>
            <Box hiddenFrom="sm">
              <Text size="xs" fw={500} c="black">
                {user.first_name}
              </Text>
            </Box>
          </Group>

          {/* Logout Button */}
          <Form action="/logout" method="POST" style={{ display: 'inline' }}>
            <Button
              variant="danger"
              size="sm"
              type="submit"
              radius="xl"
            >
              Logout
            </Button>
          </Form>
        </Group>
      </Group>
    </Box>
  );
}