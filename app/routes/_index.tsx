import { getAuthToken } from "~/utils/auth.server";
import { useTodos } from "../hooks/useTodos";
import type { Filter } from "../hooks/useTodos";
import {
  Form,
  Link,
  href,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) {
    return redirect(href("/login"));
  }

  console.log("=== Fetching TODOS==="); // debug log
  console.log('Token exits:', !!token); // debug log

  try {
    console.log("Making request to /items/tasks"); // debug log
    const response = await fetch("http://localhost:8055/items/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Task APi reponse status:", response.status); // debug log

    if (response.ok) {
      const data = await response.json();
      console.log("Raw API response: ", JSON.stringify(data, null, 2)); // debug log
      console.log("Tasks data: ", data.data); // debug log
      console.log("Number of todos:", data.data?.length || 0); // debug log
      return { todos: data.data || [] };
    }
    return { todos: [] };
  } catch (error) {
    console.error("Error Fetching todos:", error);
    return { todos: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const token = getAuthToken(request);
  if (!token) return redirect(href("/login"));

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const todoId = formData.get("todoId") as string;

  try {
    if (intent === "completed") {
      await fetch(`http://localhost:8055/items/tasks/${todoId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });
    } else if (intent === "delete") {
      await fetch(`http://localhost:8055/items/tasks/${todoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
  return null;
}

export default function Home({loaderData}: any) {
  const { filter, setFilter, search, setSearch, sortedTodos } =
    useTodos({ loaderData });

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Your Tasks
        </h1>
        <p className="text-gray-600 mb-4">Manage your todos efficiently</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Link
            to={href("/todos/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center whitespace-nowrap sm:w-auto w-full"
          >
            + Add Task
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as Filter)}
              className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {sortedTodos.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4 px-4">
            {search
              ? "Try adjusting your search terms"
              : "Create your first task to get started"}
          </p>
          <Link
            to={href("/todos/new")}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Task
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`w-full bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm ${
                todo.status === "completed" ? "opacity-75" : ""
              } ${isOverdue(todo.dueDate) && todo.status !== "completed" ? "border-l-4 border-red-500" : ""}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3
                      className={`text-base sm:text-lg font-semibold text-gray-800 break-words ${
                        todo.status === "completed"
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded shrink-0 ${
                        todo.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {todo.status}
                    </span>
                    {isOverdue(todo.dueDate) && todo.status !== "completed" && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 shrink-0">
                        Overdue
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-gray-600 mb-3 break-words ${
                      todo.status === "completed" ? "opacity-75" : ""
                    }`}
                  >
                    {todo.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-500">
                    <span className="shrink-0">
                      Created {new Date(todo.date_created).toLocaleDateString()}
                    </span>
                    {todo.dueDate && (
                      <span
                        className={`shrink-0 ${
                          isOverdue(todo.dueDate) && todo.status !== "completed"
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        Due {new Date(todo.dueDate).toLocaleDateString()}
                        {isOverdue(todo.dueDate) &&
                          todo.status !== "completed" &&
                          " (Overdue)"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  {todo.status === "pending" && (
                    <Form method="POST">
                      <input type="hidden" name="intent" value="completed" />
                      <input type="hidden" name="todoId" value={todo.id} />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        ✓ Complete
                      </button>
                    </Form>
                  )}
                  <Link
                    to={href("/todos/edit/:id", { id: todo.id.toString() })}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 text-center"
                  >
                    Edit
                  </Link>
                  <Form method="POST" className="inline">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="todoId" value={todo.id} />
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      onClick={(e) => {
                        if (
                          !window.confirm(
                            "Are you sure you want to delete this todo?"
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
