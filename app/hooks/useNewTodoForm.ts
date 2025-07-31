import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function useNewTodoForm({ actionData }: { actionData: any }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (actionData?.todo) {
      const storedTodo = localStorage.getItem("todos");
      const existing = JSON.parse(storedTodo || "[]");
      existing.push(actionData.todo);
      localStorage.setItem("todos", JSON.stringify(existing));
      setMessage("To-Do created successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [actionData, navigate]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    message,
  };
}
