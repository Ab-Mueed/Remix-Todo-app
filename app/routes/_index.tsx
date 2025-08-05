import { getAuthToken } from "~/utils/auth.server";
import { TodosService } from "~/services/todos.service";
import { useTodos } from "../hooks/useTodos";
import type { Filter } from "../hooks/useTodos";
import TodoCard from "~/components/TodoCard";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import {
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

  try {
    const todos = await TodosService.getTodos(token);
    return { todos };
  } catch (error) {
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
      await TodosService.markAsCompleted(token, todoId);
    } else if (intent === "delete") {
      await TodosService.deleteTodo(token, todoId);
    }
  } catch (error) {
    // Action failed silently
  }
  return null;
}

export default function Home({loaderData}: any) {
  const { filter, setFilter, search, setSearch, sortedTodos } =
    useTodos({ loaderData });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Your Tasks
        </h1>
        <p className="text-gray-600 mb-4">Manage your todos efficiently</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <Input
            type="text"
            id="search-todos"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth={false}
            className="sm:flex-1"
          />
          <Link
            to={href("/todos/new")}
            className="inline-block"
          >
            <Button variant="primary">
              + Add Task
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "completed"].map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f as Filter)}
              variant={filter === f ? "primary" : "secondary"}
              size="sm"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
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
            className="inline-block"
          >
            <Button variant="primary">
              Create Your First Task
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {sortedTodos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}
