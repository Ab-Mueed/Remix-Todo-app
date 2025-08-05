import { getAuthToken } from "~/utils/auth.server";
import { TodosService } from "~/services/todos.service";
import { useTodos } from "../hooks/useTodos";
import TodoCard from "~/components/TodoCard";
import Sidebar from "~/components/Sidebar";
import Button from "~/components/ui/Button";
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

  // Get search and filter parameters from URL
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "all";

  let todos: any[] = [];

  try {
    // Use server-side filtering and searching
    if (search && filter !== "all") {
      // Both search and filter
      todos = await TodosService.searchAndFilterTodos(token, search, filter as "pending" | "completed");
    } else if (search) {
      // Only search
      todos = await TodosService.searchTodos(token, search);
    } else if (filter !== "all") {
      // Only filter
      todos = await TodosService.getTodosByStatus(token, filter as "pending" | "completed");
    } else {
      // All todos
      todos = await TodosService.getTodos(token);
    }
  } catch (error) {
    // Fallback to getting all todos if server-side filtering fails
    todos = await TodosService.getTodos(token);
  }

  return { todos, search, filter };
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
    // Silently handle action failures - user will see the change didn't persist
  }
  return null;
}

export default function Home({ loaderData }: any) {
  const { filter, setFilter, search, setSearch, sortedTodos } =
    useTodos({ loaderData });

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header with Search and Filters */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm text-sm"
                />
              </div>
              <Link to={href("/todos/new")}>
                <button className="bg-slate-900 text-white px-3 py-3 rounded-full hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 w-12 h-12 inline-flex items-center justify-center font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "All", icon: "📋" },
                { key: "pending", label: "Pending", icon: "⏳" },
                { key: "completed", label: "Done", icon: "✅" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  className={`flex-1 px-3 py-2 rounded-full transition-all duration-200 flex items-center justify-center space-x-1 text-xs font-medium ${filter === option.key
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
                    }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              Your Tasks
            </h1>
            <p className="text-sm lg:text-base text-slate-600">
              {filter === "all" && "All your tasks"}
              {filter === "pending" && "Tasks waiting to be completed"}
              {filter === "completed" && "Your completed tasks"}
            </p>
          </div>

          {/* Content */}
          {sortedTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-md shadow-sm border border-slate-200 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  {search ? "No tasks found" : "No tasks yet"}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-6">
                  {search
                    ? "Try adjusting your search terms"
                    : "Create your first task to get started"}
                </p>
                <Link to={href("/todos/new")}>
                  <Button variant="primary" size="md">
                    <span className="text-xs">Create Your First Task</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTodos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
