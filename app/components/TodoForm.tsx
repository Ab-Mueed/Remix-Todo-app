import { Form } from "react-router";
import { Link, href } from "react-router";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import type { Todo } from "~/services/todos.service";

interface TodoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Todo>;
  error?: string;
  message?: string;
}

export default function TodoForm({ mode, initialData, error, message }: TodoFormProps) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Task" : "Create New Task";
  const description = isEdit ? "Update your task details" : "Add a new task to stay organized";
  const submitText = isEdit ? "Save Changes" : "Create Task";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={href("/")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-slate-600">{description}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 sm:p-8">
          <Form method="POST" className="space-y-6">
            <Input
              id="todo-title"
              name="title"
              label="Title"
              placeholder="Enter task title..."
              defaultValue={initialData?.title}
              required
            />

            <Textarea
              id="todo-description"
              name="description"
              label="Description"
              placeholder="Describe your task..."
              defaultValue={initialData?.description}
              required
            />

            <Input
              id="todo-due-date"
              type="date"
              name="dueDate"
              label="Due Date"
              min={new Date().toISOString().split("T")[0]}
              defaultValue={initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : ""}
              required={!isEdit}
            />

            <div className="pt-4">
              <Button type="submit" fullWidth size="lg">
                {submitText}
              </Button>
            </div>
          </Form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-emerald-700 font-medium">{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 