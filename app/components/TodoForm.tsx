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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-6">
        <Link
          to={href("/")}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block text-sm sm:text-base"
        >
          ← Back to Tasks
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <Form method="POST" className="space-y-4 sm:space-y-5">
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

          <Button type="submit" fullWidth>
            {submitText}
          </Button>
        </Form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {error}
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