import { useTodos } from "../hooks/useTodos";
import type { Filter } from "../hooks/useTodos";
import { Link, href } from "react-router";

export default function Home() {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    sortedTodos,
    markAsCompleted,
    deleteTodo,
  } = useTodos();

  return (
    <div className="mx-auto p-4">
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">
          Welcome to To-Do App!
        </h1>
        <p className="text-gray-600 text-center">Your tasks will appear here</p>
        <Link
          to={href("/todos/new")}
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
      {sortedTodos.length === 0 ? (
        <p className="text-gray-600">No todos yet. Try creating a one!</p>
      ) : (
        <ul className="space-y-4">
          {sortedTodos.map((todo) => (
            <li
              key={todo.id}
              className="border rounded-md p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <h2><span className="text-sm text-gray-500">Title: </span>{todo.title}</h2>
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
                    to={href("/todos/edit/:id", {id: todo.id.toString()})}
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

              <p><span className="text-sm text-gray-500">Description: </span>{todo.description}</p>
              <p><span className="text-sm text-gray-500">Created At: </span>{new Date(todo.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                Due:{" "}
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString()
                  : "Not Set"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
