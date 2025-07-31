import type { Route } from "./+types/todos.edit_.$id";
import { Form, type ActionFunctionArgs } from "react-router";
import { useEditTodoForm } from "../../hooks/useEditTodoForm";

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
    <main className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit To-Do</h1>
      <Form method="POST" className="flex flex-col gap-4 bg-white p-4 rounded shadow">
        <input type="hidden" name="id" value={todo?.id} />
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium mb-1">Title</label>
          <input
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-medium mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate" className="font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <button type="submit" className="hover:bg-emerald-400 px-4 py-2 rounded bg-emerald-300">
          Save Changes
        </button>
      </Form>
      {message && <p className="text-green-400 italic mt-2">{message}</p>}
    </main>
  );
}
