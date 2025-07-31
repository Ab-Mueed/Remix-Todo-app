import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export type Todo = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  status: "pending" | "completed";
};


export function useEditTodoForm({ actionData, id }: { actionData: any; id: number }) {
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedTodo = localStorage.getItem("todos");
    if (storedTodo) {
      const allTodos = JSON.parse(storedTodo);
      const resultantTodo = allTodos.find((todo: Todo) => todo.id === id);
      if (resultantTodo) {
        setTodo(resultantTodo);
        setTitle(resultantTodo.title);
        setDescription(resultantTodo.description);
        setDueDate(resultantTodo.dueDate || "");
      }
    }
  }, [id]);

  useEffect(() => {
    if (actionData?.todo) {
      const storedTodo = localStorage.getItem("todos");
      if (storedTodo) {
        const allTodos = JSON.parse(storedTodo);
        const updateTodo = allTodos.map((todo: Todo) =>
          todo.id === actionData.todo.id
            ? {
                ...todo,
                title: actionData.todo.title,
                description: actionData.todo.description,
              }
            : todo
        );
        localStorage.setItem("todos", JSON.stringify(updateTodo));
        setMessage("To-Do updated successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  }, [actionData, navigate]);

  return {
    todo,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    message,
  };
}
