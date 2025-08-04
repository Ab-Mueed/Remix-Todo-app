import type { Route } from "./+types/todos.edit_.$id";
import {
  Form,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { useEditTodoForm } from "../../hooks/useEditTodoForm";
import { Link, href, redirect } from "react-router";
import { getAuthToken } from "~/utils/auth.server";

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
    console.log("Fetching todo with id:", todoId);

    const response = await fetch(
      `http://localhost:8055/items/tasks/${todoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Fetch. todo response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Todo data fetched:", data);
      return { todo: data.data };
    } else {
      console.error("Failed to fetch todo");
      return redirect(href("/"));
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
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
    console.log("Updating todo with ID:", todoId, "with data:", {
      title,
      description,
      dueDate,
    });

    const updateData: any = {
      title,
      description,
    };

    if (dueDate) {
      updateData.dueDate = dueDate + "T10:00:00";
    }
    const response = await fetch(
      `http://localhost:8055/items/tasks/${todoId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Update todo response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Todo updated successfully:", data);
      return redirect(href("/"));
    } else {
      const errorData = await response.json();
      console.log("Todo updated successfully:", errorData);
      return {
        error: "Failed to update Task. Please try again",
      };
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    return {
      error: "An error occurred while updating the task.",
    };
  }
}

export default function EditTodo({
  actionData,
  loaderData,
  params,
}: Route.ComponentProps) {
  const id = parseInt(params.id);
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    message,
  } = useEditTodoForm({
    actionData,
    loaderData,
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6">
        <Link
          to={href("/")}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block text-sm sm:text-base"
        >
          ← Back to Tasks
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Edit Task
        </h1>
        <p className="text-gray-600">Update your task details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <Form method="POST" className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              name="title"
              id="title"
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              placeholder="Describe your task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded hover:bg-blue-700 font-medium text-sm sm:text-base"
          >
            Save Changes
          </button>
        </Form>

        {actionData?.error && (
          <div className="mt-4 p-3 bg-red-100 text-white rounded-md text-sm">
            {actionData.error}
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
