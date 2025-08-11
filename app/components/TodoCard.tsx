import { Form, Link, href } from "react-router";
import { Paper, Box, Group, Text, Badge, Stack, Flex } from "@mantine/core";
import { IconClock, IconCalendar, IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import Button from "./ui/Button";
import type { Todo } from "~/services/todos.service";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isCompleted = todo.status === "completed";
  const overdue = isOverdue(todo.dueDate) && !isCompleted;

  return (
    <Paper
      shadow="md"
      radius="md"
      bg="white"
      style={{
        borderLeft: overdue ? '4px solid var(--mantine-color-red-6)' : undefined
      }}
    >
      <Box p="xl">
        <Box style={{ opacity: isCompleted ? 0.6 : 1 }}>
          <Flex justify="space-between" align="flex-start" gap="md" mb="sm">
            <Box flex={1} style={{ minWidth: 0 }}>
              {/* Header */}
              <Group justify="space-between" align="flex-start" mb="sm">
                <Box flex={1} style={{ minWidth: 0 }}>
                  <Text
                    size="lg"
                    fw={600}
                    c={isCompleted ? 'gray.6' : 'black'}
                    style={{
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      wordBreak: 'break-word'
                    }}
                  >
                    {todo.title}
                  </Text>
                </Box>
                <Group gap="xs" style={{ flexShrink: 0 }}>
                  <Badge
                    color={isCompleted ? "teal" : "orange"}
                    variant="filled"
                    size="sm"
                    radius="xl"
                  >
                    {isCompleted ? "Completed" : "Pending"}
                  </Badge>
                  {overdue && (
                    <Badge color="red" variant="filled" size="sm" radius="xl">
                      Overdue
                    </Badge>
                  )}
                </Group>
              </Group>

              {/* Description */}
              <Text
                size="sm"
                c="gray.7"
                mb="md"
                style={{
                  wordBreak: 'break-word',
                  lineHeight: 1.6
                }}
              >
                {todo.description}
              </Text>

              {/* Metadata */}
              <Group gap="md" style={{ flexWrap: 'wrap' }}>
                <Group gap="xs">
                  <IconClock size={12} color="var(--mantine-color-gray-6)" />
                  <Text size="xs" c="gray.6">
                    Created {new Date(todo.date_created).toLocaleDateString()}
                  </Text>
                </Group>
                {todo.dueDate && (
                  <Group gap="xs">
                    <IconCalendar size={12} color={overdue ? "var(--mantine-color-red-6)" : "var(--mantine-color-gray-6)"} />
                    <Text 
                      size="xs" 
                      c={overdue ? "red.7" : "gray.6"}
                      fw={overdue ? 600 : 400}
                    >
                      Due {new Date(todo.dueDate).toLocaleDateString()}
                      {overdue && " (Overdue)"}
                    </Text>
                  </Group>
                )}
              </Group>
            </Box>
          </Flex>
        </Box>

        {/* Actions */}
        <Box pt="md" mt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Group justify="flex-end" gap="sm">
            {!isCompleted && (
              <Form method="POST" style={{ display: 'inline' }}>
                <input type="hidden" name="intent" value="completed" />
                <input type="hidden" name="todoId" value={todo.id} />
                <Button variant="success" size="sm" type="submit">
                  <IconCheck size={14} style={{ marginRight: '4px' }} />
                  <Text size="xs">Complete</Text>
                </Button>
              </Form>
            )}

            <Link to={href("/todos/edit/:id", { id: todo.id.toString() })} style={{ display: 'inline-block', textDecoration: 'none' }}>
              <Button variant="secondary" size="sm">
                <IconEdit size={14} style={{ marginRight: '4px' }} />
                <Text size="xs">Edit</Text>
              </Button>
            </Link>

            <Form method="POST" style={{ display: 'inline' }}>
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <Button 
                variant="danger" 
                size="sm" 
                type="submit"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!window.confirm("Are you sure you want to delete this task?")) {
                    e.preventDefault();
                  }
                }}
              >
                <IconTrash size={14} style={{ marginRight: '4px' }} />
                <Text size="xs">Delete</Text>
              </Button>
            </Form>
          </Group>
        </Box>
      </Box>
    </Paper>
  );
} 