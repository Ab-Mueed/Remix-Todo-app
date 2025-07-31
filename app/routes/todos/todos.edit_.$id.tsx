import type { Route } from "./+types/todos.edit_.$id";
import { useNavigate, Form, type ActionFunctionArgs } from "react-router";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  status: "pending" | "completed";
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = parseInt(formData.get("id") as string);
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !description) {
    return {
      error: "Title and description are required",
    };
  }

  const updatedTodo = {
    id,
    title,
    description,
  };

  return { todo: updatedTodo };
}

export default function EditTodo({ actionData, params }: Route.ComponentProps) {
  const id = parseInt(params.id);
  const navigate = useNavigate();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // useEffect for prefilling the form
  useEffect(() => {
    const storedTodo = localStorage.getItem("todos");
    if (storedTodo) {
      const allTodos = JSON.parse(storedTodo);
      const resultantTodo = allTodos.find((todo: Todo) => todo.id === id);
      if (resultantTodo) {
        setTodo(resultantTodo);
        setTitle(resultantTodo.title);
        setDescription(resultantTodo.description);
      }
    }
  }, [id]);

  // useEffect for updating the todo in localStorage
  useEffect(() => {
    if (actionData?.todo) {
      const storedTodo = localStorage.getItem("todos");
      if (storedTodo) {
        const allTodos = JSON.parse(storedTodo);
        const updateTodo = allTodos.map((todo: Todo) =>
          todo.id === actionData.todo.id
            ? {
                ...todo,
                title: actionData.todo.title,
                description: actionData.todo.description,
              }
            : todo
        );

        localStorage.setItem("todos", JSON.stringify(updateTodo));
        setMessage("To-Do updated successfully");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  }, [actionData]);

  console.log("todos in editpage: ", todo);

  return (
    <main>
      <h1>Edit To-Do</h1>
      <Form method="POST">
        <input type="hidden" name="id" value={todo?.id} />
        <div>
          <label htmlFor="title" className="font-medium mb-1">
            Title
          </label>
          <input
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md"
            required
          />
        </div>

        <button type="submit" className="hover:bg-emerald-400">
          Save Changes
        </button>
      </Form>
      {message && <p className="text-green-400 italic">{message}</p>}
    </main>
  );
}
