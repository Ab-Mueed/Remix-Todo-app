import type { Route } from "./+types/todos.new";
import { Form, type ActionFunctionArgs } from "react-router";
import { useNewTodoForm } from "../../hooks/useNewTodoForm";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formTitle = formData.get("title")?.toString().trim();
  const formDescription = formData.get("description")?.toString().trim();
  const dueDate = formData.get("dueDate")?.toString().trim();

  if (!formTitle || !formDescription || !dueDate) {
    return {
      error: "Title, description and due-date are required",
    };
  }

  const newTodo = {
    id: Date.now(),
    title: formTitle,
    description: formDescription,
    status: "pending",
    createdAt: new Date().toISOString(),
    dueDate,
  };

  return { todo: newTodo };
}
// ...existing code...

export default function NewToDoPage({ actionData }: Route.ComponentProps) {
  const { title, setTitle, description, setDescription, message } =
    useNewTodoForm({
      actionData,
    });

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New To-Do</h1>
      <Form method="POST">
        <div>
          <label htmlFor="title" className="font-medium mb-1">
            Title
          </label>
          <input
            name="title"
            id="title"
            className="border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="font-medium mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            className="border rounded"
            required
          />
        </div>

        <button type="submit" className="hover:bg-blue-400">
          Create
        </button>
      </Form>
      {message && <p className="text-green-500 font-light italic">{message}</p>}
    </div>
  );
}
