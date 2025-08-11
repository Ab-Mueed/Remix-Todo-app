import { getAuthToken } from "~/utils/auth.server";
import { TodosService } from "~/services/todos.service";
import { useTodos } from "../hooks/useTodos";
import TodoCard from "~/components/TodoCard";
import Sidebar from "~/components/Sidebar";
import {
  Box,
  Container,
  Text,
  Group,
  Stack,
  Paper,
  Center,
  Avatar,
  TextInput
} from "@mantine/core";
import { IconClipboard, IconPlus } from "@tabler/icons-react";
import Button from "~/components/ui/Button";
import {
  Link,
  href,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) {
    return redirect(href("/login"));
  }

  // Get search and filter parameters from URL
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "all";

  let todos: any[] = [];

  try {
    // Use server-side filtering and searching
    if (search && filter !== "all") {
      // Both search and filter
      todos = await TodosService.searchAndFilterTodos(
        token,
        search,
        filter as "pending" | "completed"
      );
    } else if (search) {
      // Only search
      todos = await TodosService.searchTodos(token, search);
    } else if (filter !== "all") {
      // Only filter
      todos = await TodosService.getTodosByStatus(
        token,
        filter as "pending" | "completed"
      );
    } else {
      // All todos
      todos = await TodosService.getTodos(token);
    }
  } catch (error) {
    // Fallback to getting all todos if server-side filtering fails
    todos = await TodosService.getTodos(token);
  }

  return { todos, search, filter };
}

export async function action({ request }: ActionFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const todoId = formData.get("todoId") as string;

  try {
    if (intent === "completed") {
      await TodosService.markAsCompleted(token, todoId);
    } else if (intent === "delete") {
      await TodosService.deleteTodo(token, todoId);
    }
  } catch (error) {
    // Silently handle action failures - user will see the change didn't persist
  }
  return null;
}

export default function Home({ loaderData }: any) {
  const { filter, setFilter, search, setSearch, sortedTodos } = useTodos({
    loaderData,
  });

  const filterOptions = [
    { key: "all", label: "All", icon: "📋" },
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "completed", label: "Done", icon: "✅" },
  ];

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      backgroundColor: 'var(--mantine-color-gray-0)',
      overflow: 'hidden'
    }}>
      {/* Desktop Sidebar - Only show on large screens */}
      <Box visibleFrom="lg" className="sidebar-wrapper">
        <Sidebar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Mobile Header with Search and Filters */}
        <Box
          hiddenFrom="lg"
          bg="white"
          p="md"
          style={{
            borderBottom: '1px solid var(--mantine-color-gray-3)',
            zIndex: 10,
            flexShrink: 0
          }}
        >
          <Stack gap="md">
            {/* Search */}
            <Group gap="sm">
              <TextInput
                flex={1}
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1px solid var(--mantine-color-gray-4)',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-blue-6)',
                      backgroundColor: 'white',
                      color: 'black'
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)'
                    }
                  }
                }}
              />
              <Link to={href("/todos/new")} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" style={{ width: '48px', height: '48px', padding: 0 }} radius="xl">
                  <IconPlus size={16} />
                </Button>
              </Link>
            </Group>

            {/* Filter Tabs */}
            <Group gap="xs">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  variant={filter === option.key ? "primary" : "secondary"}
                  size="sm"
                  radius="xl"
                  style={{ flex: 1, height: '32px', padding: '0 12px' }}
                >
                  <Group gap="4px" justify="center">
                    <Text size="xs" c="inherit">{option.icon}</Text>
                    <Text size="xs" c="inherit" fw={500}>{option.label}</Text>
                  </Group>
                </Button>
              ))}
            </Group>
          </Stack>
        </Box>

        {/* Scrollable Content Container */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: 'var(--mantine-color-gray-0)'
        }}>
          <Container size="xl" px="md" py="xl">
            {/* Desktop Header */}
            <Box visibleFrom="lg" mb="xl">
              <Text size="xl" fw={700} mb="xs" c="black">
                Your Tasks
              </Text>
              <Text size="sm" c="gray.7">
                {filter === "all" && "All your tasks"}
                {filter === "pending" && "Tasks waiting to be completed"}
                {filter === "completed" && "Your completed tasks"}
              </Text>
            </Box>

            {/* Content */}
            {sortedTodos.length === 0 ? (
              <Center py="xl">
                <Paper shadow="sm" radius="md" withBorder bg="white" p="xl" maw={400} w="100%">
                  <Stack align="center" gap="lg">
                    <Avatar
                      size="xl"
                      radius="xl"
                      color="gray"
                      variant="light"
                    >
                      <IconClipboard size={40} stroke={1.5} />
                    </Avatar>
                    <Stack align="center" gap="xs">
                      <Text size="lg" fw={600} c="black">
                        {search ? "No tasks found" : "No tasks yet"}
                      </Text>
                      <Text size="sm" c="gray.7" ta="center">
                        {search
                          ? "Try adjusting your search terms"
                          : "Create your first task to get started"}
                      </Text>
                    </Stack>
                    <Link to={href("/todos/new")} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="md">
                        Create Your First Task
                      </Button>
                    </Link>
                  </Stack>
                </Paper>
              </Center>
            ) : (
              <Stack gap="md">
                {sortedTodos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </Stack>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}
