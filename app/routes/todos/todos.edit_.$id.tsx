import type { Route } from "./+types/todos.edit_.$id";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  href,
  redirect,
} from "react-router";
import { getAuthToken } from "~/utils/auth.server";
import { TodosService } from "~/services/todos.service";
import TodoForm from "~/components/TodoForm";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) {
    return redirect(href("/login"));
  }

  const todoId = params.id;
  if (!todoId) {
    return redirect(href("/"));
  }

  try {
    const todo = await TodosService.getTodo(token, todoId);
    if (!todo) {
      return redirect(href("/"));
    }
    return { todo };
  } catch (error) {
    return redirect(href("/"));
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) {
    return redirect(href("/login"));
  }

  const todoId = params.id;
  if (!todoId) {
    return redirect(href("/"));
  }

  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const dueDate = formData.get("dueDate")?.toString().trim();

  if (!title || !description) {
    return {
      error: "Title and description are required",
    };
  }

  try {
    const updateData: any = {
      title,
      description,
    };

    if (dueDate) {
      updateData.dueDate = dueDate + "T10:00:00";
    }

    await TodosService.updateTodo(token, todoId, updateData);
    return redirect(href("/"));
  } catch (error) {
    return {
      error: "Failed to update task. Please try again.",
    };
  }
}

export default function EditTodo({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <TodoForm
      mode="edit"
      initialData={loaderData?.todo}
      error={actionData?.error}
    />
  );
}
