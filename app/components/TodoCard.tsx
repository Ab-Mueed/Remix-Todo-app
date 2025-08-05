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
      className={`bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 ${
        isCompleted ? "opacity-60" : ""
      } ${overdue ? "border-l-4 border-l-red-500" : ""}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base sm:text-lg font-semibold text-slate-900 break-words ${
                    isCompleted ? "line-through text-slate-400" : ""
                  }`}
                >
                  {todo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isCompleted ? "Completed" : "Pending"}
                </span>
                {overdue && (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-sm sm:text-base text-slate-600 mb-4 break-words leading-relaxed ${
                isCompleted ? "opacity-60" : ""
              }`}
            >
              {todo.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Created {new Date(todo.date_created).toLocaleDateString()}
              </span>
              {todo.dueDate && (
                <span className={`flex items-center gap-1 ${overdue ? "text-red-600 font-medium" : ""}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due {new Date(todo.dueDate).toLocaleDateString()}
                  {overdue && " (Overdue)"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          {!isCompleted && (
            <Form method="POST" className="inline">
              <input type="hidden" name="intent" value="completed" />
              <input type="hidden" name="todoId" value={todo.id} />
              <Button type="submit" variant="success" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete
              </Button>
            </Form>
          )}
          
          <Link to={href("/todos/edit/:id", { id: todo.id.toString() })} className="inline-block">
            <Button variant="secondary" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
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
                if (!window.confirm("Are you sure you want to delete this task?")) {
                  e.preventDefault();
                }
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
} 