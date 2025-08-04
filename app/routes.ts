import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public routes (no authentication required)
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
 

  // Protected routes (authentication required)
  route("", "routes/_layout.tsx", [
    index("routes/_index.tsx"),
    route("todos/new", "routes/todos/todos.new.tsx"), // todos/new
    route("todos/edit/:id", "routes/todos/todos.edit_.$id.tsx"), // todos/edit/:id
    route("/logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
