import type { Route } from "./+types/todos.edit_.$id";
import { Form, type ActionFunctionArgs } from "react-router";
import { useEditTodoForm } from "../../hooks/useEditTodoForm";
import { Link, href } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = parseInt(formData.get("id") as string);
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const dueDate = formData.get("dueDate")?.toString().trim();
  if (!title || !description) {
    return {
      error: "Title and description are required",
    };
  }

  const updatedTodo = {
    id,
    title,
    description,
    dueDate,
  };

  return { todo: updatedTodo };
}

export default function EditTodo({ actionData, params }: Route.ComponentProps) {
  const id = parseInt(params.id);
  const {
    todo,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    message,
  } = useEditTodoForm({
    actionData,
    id,
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Edit Task</h1>
        <p className="text-gray-600">Update your task details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <Form method="POST" className="space-y-4 sm:space-y-5">
          <input type="hidden" name="id" value={todo?.id} />
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
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

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
