import { Form } from "react-router";
import { Link, href } from "react-router";
import { Container, Box, Text, Paper, Stack, Group, Alert } from "@mantine/core";
import { IconArrowLeft, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import type { Todo } from "~/services/todos.service";

interface TodoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Todo>;
  error?: string;
  message?: string;
}

export default function TodoForm({ mode, initialData, error, message }: TodoFormProps) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Task" : "Create New Task";
  const description = isEdit ? "Update your task details" : "Add a new task to stay organized";
  const submitText = isEdit ? "Save Changes" : "Create Task";

  return (
    <Box style={{ minHeight: '100vh' }} bg="gray.0">
      <Container size="md" py="xl">
        {/* Header */}
        <Box mb="xl">
          <Link
            to={href("/")}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--mantine-color-gray-6)',
              textDecoration: 'none',
              marginBottom: '24px',
              transition: 'color 200ms ease',
              '&:hover': {
                color: 'var(--mantine-color-gray-8)'
              }
            }}
          >
            <IconArrowLeft size={16} />
            Back to Tasks
          </Link>
          <Text size="xl" fw={700} mb="xs" c="black">
            {title}
          </Text>
          <Text size="sm" c="gray.7">{description}</Text>
        </Box>

        {/* Form */}
        <Paper shadow="md" radius="md" bg="white" p="xl">
          <Form method="POST">
            <Stack gap="lg">
              <Input
                id="todo-title"
                name="title"
                label="Title"
                placeholder="Enter task title..."
                defaultValue={initialData?.title}
                required
              />

              <Textarea
                id="todo-description"
                name="description"
                label="Description"
                placeholder="Describe your task..."
                defaultValue={initialData?.description}
                required
              />

              <Input
                id="todo-due-date"
                type="date"
                name="dueDate"
                label="Due Date"
                min={new Date().toISOString().split("T")[0]}
                defaultValue={initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : ""}
                required={!isEdit}
              />

              <Box pt="md">
                <Button fullWidth size="lg" type="submit">
                  {submitText}
                </Button>
              </Box>
            </Stack>
          </Form>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
              radius="lg"
              mt="lg"
            >
              {error}
            </Alert>
          )}

          {message && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Success"
              color="teal"
              variant="light"
              radius="lg"
              mt="lg"
            >
              {message}
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
} 