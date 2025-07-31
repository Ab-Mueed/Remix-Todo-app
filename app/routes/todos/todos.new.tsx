import type { Route } from "./+types/todos.new";
import {
  Form,
  useNavigate,
  type ActionFunctionArgs,
} from "react-router";
import { useEffect, useState } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !description) {
    return {
      error: "Title and description are required",
    };
  }

  const newTodo = {
    id: Date.now(),
    title,
    description,
    status: "pending",
    createdAt: new Date().toISOString,
  };

  return { todo: newTodo };
}

export default function NewToDoPage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate(); // To help navigate to another page from client side
  const [message, setMessage] = useState("");
  // Since using localStorage need to use useEffect for client side modification
  useEffect(() => {
    if (actionData?.todo) {
      const existing = JSON.parse(localStorage.getItem("todos") || "[]"); // hey browser do u have soemthing saved with the key 'todos'? If not then return an empty array
      existing.push(actionData.todo); // turns the array into a string
      localStorage.setItem("todos", JSON.stringify(existing));

      setMessage("To-Do created successfully");

      // Used so that Success Message is atleast visible to the user before navigating to homepage
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [actionData]);

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New To-Do</h1>
      <Form method="POST">
        <div>
          <label htmlFor="title" className="font-medium mb-1">
            Title
          </label>
          <input name="title" id="title" className="border rounded" required />
        </div>
        <div>
          <label htmlFor="description" className="font-medium mb-1">
            Title
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
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
