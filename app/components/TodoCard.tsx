import { Form, Link, href } from "react-router";
import Button from "./ui/Button";
import type { Todo } from "~/services/todos.service";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isCompleted = todo.status === "completed";
  const overdue = isOverdue(todo.dueDate) && !isCompleted;

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm ${
        isCompleted ? "opacity-75" : ""
      } ${overdue ? "border-l-4 border-red-500" : ""}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3
              className={`text-base sm:text-lg font-semibold text-gray-800 break-words ${
                isCompleted ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded shrink-0 ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {todo.status}
            </span>
            {overdue && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 shrink-0">
                Overdue
              </span>
            )}
          </div>

          <p
            className={`text-gray-600 mb-3 break-words ${
              isCompleted ? "opacity-75" : ""
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
                  overdue ? "text-red-600 font-medium" : ""
                }`}
              >
                Due {new Date(todo.dueDate).toLocaleDateString()}
                {overdue && " (Overdue)"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {!isCompleted && (
            <Form method="POST">
              <input type="hidden" name="intent" value="completed" />
              <input type="hidden" name="todoId" value={todo.id} />
              <Button type="submit" variant="success" size="sm">
                ✓ Complete
              </Button>
            </Form>
          )}
          
          <Link
            to={href("/todos/edit/:id", { id: todo.id.toString() })}
            className="inline-block"
          >
            <Button variant="primary" size="sm">
              Edit
            </Button>
          </Link>
          
          <Form method="POST" className="inline">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="todoId" value={todo.id} />
            <Button
              type="submit"
              variant="danger"
              size="sm"
              onClick={(e) => {
                if (!window.confirm("Are you sure you want to delete this todo?")) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
} 