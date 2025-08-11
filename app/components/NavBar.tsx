import { Form, useLoaderData } from "react-router";
import { Box, Group, Text, Avatar, Stack } from "@mantine/core";
import Button from "./ui/Button";

export default function NavBar() {
  const loaderData = useLoaderData<{ user: any }>();

  if (!loaderData?.user) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          position: 'relative',
          zIndex: 50,
          flexShrink: 0,
          padding: '12px 16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Text c="gray.7">Loading...</Text>
        </div>
      </div>
    );
  }

  const { user } = loaderData;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        position: 'relative',
        zIndex: 50,
        flexShrink: 0,
        padding: '12px 16px'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        minHeight: '40px'
      }}>
        {/* Left side - Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Avatar
            size="sm"
            radius="xl"
            color="blue"
            variant="filled"
          >
            T
          </Avatar>
          <Text size="md" fw={600} c="black" style={{ whiteSpace: 'nowrap' }}>
            TodoApp
          </Text>
        </div>

        {/* Right side - User info and logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          flexShrink: 0,
          minWidth: 0
        }}>
          {/* User Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderRadius: '9999px',
              padding: '6px 10px',
              minWidth: 0,
              maxWidth: '150px'
            }}
          >
            <Avatar
              size="xs"
              radius="xl"
              color="gray"
              variant="light"
            >
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </Avatar>
            <Text 
              size="xs" 
              fw={500} 
              c="black" 
              truncate
              style={{ minWidth: 0 }}
            >
              {user.first_name}
            </Text>
          </div>

          {/* Logout Button */}
          <Form action="/logout" method="POST" style={{ display: 'inline', flexShrink: 0 }}>
            <Button
              variant="danger"
              size="sm"
              type="submit"
              radius="xl"
              style={{ fontSize: '12px', padding: '6px 12px', height: '32px' }}
            >
              Logout
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}