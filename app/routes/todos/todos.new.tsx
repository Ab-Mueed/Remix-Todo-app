import type { Route } from "./+types/todos.new";
import { type ActionFunctionArgs, redirect, href } from "react-router";
import { getAuthToken } from "~/utils/auth.server";
import { TodosService } from "~/services/todos.service";
import TodoForm from "~/components/TodoForm";

export async function action({ request }: ActionFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) {
    return redirect(href("/login"));
  }

  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const dueDate = formData.get("dueDate")?.toString().trim();

  if (!title || !description || !dueDate) {
    return {
      error: "Title, description and due-date are required",
    };
  }

  try {
    await TodosService.createTodo(token, {
      title,
      description,
      dueDate: dueDate + "T10:00:00",
      status: "pending",
    });

    return redirect(href("/"));
  } catch (error) {
    return {
      error: "Failed to create task. Please try again.",
    };
  }
}

export default function NewToDoPage({ actionData }: Route.ComponentProps) {
  return (
    <TodoForm
      mode="create"
      error={actionData?.error}
    />
  );
}
