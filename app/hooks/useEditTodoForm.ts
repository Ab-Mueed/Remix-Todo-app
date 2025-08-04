import { useEffect, useState } from "react";

export type Todo = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  status: "pending" | "completed";
};

export function useEditTodoForm({
  actionData,
  loaderData,
}: {
  actionData: any;
  loaderData: any;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  // Client side hook for accessing localStorage to prefill title, description, due date on form
  useEffect(() => {
    if (loaderData?.todo) {
      setTitle(loaderData?.todo.title);
      setDescription(loaderData?.todo.description);
      if (loaderData?.todo.dueDate) {
        const date = new Date(loaderData?.todo.dueDate);
        setDueDate(date.toISOString().split("T")[0]);
      }
    }
  }, [loaderData]);

  // client side hook for checking any updates in title, description, due date and updating the todo respectively
  // using actionData provided by react-router to listen for any changes in form
  useEffect(() => {
    if (actionData?.error) {
      setMessage("");
    } else if (actionData?.todo) {
      setMessage("Task updated successfully");
    }
  }, [actionData]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    message,
  };
}
