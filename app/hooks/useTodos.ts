import { useEffect, useState } from "react";

export type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  createdAt: string;
  dueDate?: string;
};

export type Filter = "all" | "pending" | "completed";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const filteredTodos = todos.filter((todo) => {
    const statusMatch = filter === "all" || todo.status === filter;
    const searchMatch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const sortedTodos = [...filteredTodos].sort((a,b) => {
    const dateA = new Date(a.dueDate || "").getTime();
    const dateB = new Date(b.dueDate || "").getTime();
    return dateA - dateB;
  })
  function markAsCompleted(id: number) {
    const updatedTodo = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "completed" as const } : todo
    );
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
  }

  function deleteTodo(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;
    const updatedTodo = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
  }

  return {
    todos,
    setTodos,
    filter,
    setFilter,
    search,
    setSearch,
    filteredTodos,
    sortedTodos,
    markAsCompleted,
    deleteTodo,
  };
}
