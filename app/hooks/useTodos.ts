import { useEffect, useState } from "react";

export type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  date_created: string;
  dueDate?: string;
  user_created: string;
};

export type Filter = "all" | "pending" | "completed";

export function useTodos({ loaderData }: any) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (loaderData?.todos) {
      setTodos(loaderData.todos);
    }
  }, [loaderData]);

  // Filter todo based on status and/or title & description
  const filteredTodos = todos.filter((todo: any) => {
    const statusMatch = filter === "all" || todo.status === filter;
    const searchMatch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Sort Todos based on due date
  const sortedTodos = [...filteredTodos].sort((a: any,b: any) => {
    const dateA = new Date(a.dueDate || "").getTime();
    const dateB = new Date(b.dueDate || "").getTime();
    return dateA - dateB;
  })

  // Marks a Todo as completed Function Logic
  // function markAsCompleted(id: number) {
  //   const updatedTodo = todos.map((todo) =>
  //     todo.id === id ? { ...todo, status: "completed" as const } : todo
  //   );
  //   setTodos(updatedTodo);
  //   localStorage.setItem("todos", JSON.stringify(updatedTodo));
  // }

  // Delete Todo Function Logic
  // function deleteTodo(id: number) {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this todo?"
  //   );
  //   if (!confirmDelete) return;
  //   const updatedTodo = todos.filter((todo) => todo.id !== id);
  //   setTodos(updatedTodo);
  //   localStorage.setItem("todos", JSON.stringify(updatedTodo));
  // }

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredTodos,
    sortedTodos,
  };
}
