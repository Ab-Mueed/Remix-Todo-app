import { Link, href } from "react-router";
import { Box, Stack, Text, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import type { Filter } from "~/hooks/useTodos";

interface SidebarProps {
  search: string;
  setSearch: (search: string) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

export default function Sidebar({ search, setSearch, filter, setFilter }: SidebarProps) {
  const filterOptions = [
    { key: "all", label: "All Tasks", icon: "📋" },
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "completed", label: "Completed", icon: "✅" },
  ] as const;

  return (
    <Box
      w={256}
      bg="white"
      h="100vh"
      pos="sticky"
      top={0}
      style={{
        borderRight: '1px solid var(--mantine-color-gray-3)',
        flexDirection: 'column'
      }}
      className="hidden lg:flex"
    >
      {/* Header */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="sm" fw={600} mb="sm" c="black">
          Search & Filter
        </Text>

        {/* Search Bar */}
        <Box mb="md">
          <Input
            type="text"
            id="search-todos"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        {/* New Task Button */}
        <Link to={href("/todos/new")} style={{ textDecoration: 'none' }}>
          <Button variant="primary" fullWidth size="sm">
            <IconPlus size={16} style={{ marginRight: '8px' }} />
            New Task
          </Button>
        </Link>
      </Box>

      {/* Filter Options */}
      <Box flex={1} p="md">
        <Text size="xs" fw={500} c="gray.7" mb="sm" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
          Filter by Status
        </Text>
        <Stack gap="xs">
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              onClick={() => setFilter(option.key as Filter)}
              variant={filter === option.key ? "primary" : "secondary"}
              size="sm"
              fullWidth
              style={{ justifyContent: 'flex-start', height: '36px' }}
            >
              <Group gap="xs">
                <Text size="sm" c="inherit">{option.icon}</Text>
                <Text size="sm" c="inherit" fw={500}>{option.label}</Text>
              </Group>
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}