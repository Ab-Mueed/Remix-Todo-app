import { useEffect, useState } from "react";
import { Link } from "react-router";

type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  createdAt: string;
};

type Filter = "all" | "pending" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("Inside of useEffect in _index.tsx");
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos)); // Just convert to proper array from string
    }
  }, []);

  const filteredTodos = todos.filter((todo) => {
    const statusMatch = filter === "all" || todo.status === filter;
    const searchMatch =
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  function markAsCompleted(id: number) {
    const updatedTodo = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "completed" as const } : todo
    );

    setTodos(updatedTodo);

    localStorage.setItem("todos", JSON.stringify(updatedTodo));
  }

  // Used to delete the todo
  function deleteTodo(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;

    const updatedTodo = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
  }

  return (
    <div className="mx-auto p-4">
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">
          Welcome to To-Do App!
        </h1>
        <p className="text-gray-600 text-center">Your tasks will appear here</p>
        <Link
          to="/todos/new"
          className="border p-2 rounded hover:bg-blue-400 w-40"
        >
          {" "}
          + Add New To-Do{" "}
        </Link>

        <input
          type="text"
          placeholder="Seach by Title or Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md"
        />
      </div>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as Filter)}
            className={`px-3 py-1 rounded-md ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {/* Just to make button text look nice, Captilalize first letter and then add rest of the word */}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filteredTodos.length === 0 ? (
        <p className="text-gray-600">No todos yet. Try creating a one!</p>
      ) : (
        <ul className="space-y-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="border rounded-md p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <h2>{todo.title}</h2>
                  <span
                    className={`text-sm px-2 py-1 rounded-md ${todo.status === "completed" ? "bg-green-400" : "bg-yellow-200"}`}
                  >
                    ({todo.status})
                  </span>

                  {todo.status === "pending" && (
                    <button
                      onClick={() => markAsCompleted(todo.id)}
                      className="text-sm px-3 py-1 bg-green-300 rounded-md hover:bg-green-600"
                    >
                      {" "}
                      ✔️ Mark as Completed{" "}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`todos/edit/${todo.id}`}
                    className="text-sm px-3 py-1 bg-blue-300 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-sm px-3 py-1 bg-red-300 rounded-md hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p>{todo.description}</p>
              <p>{new Date(todo.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
