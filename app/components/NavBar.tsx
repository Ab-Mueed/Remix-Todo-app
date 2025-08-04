import { Link, href, Form, useLoaderData } from "react-router";

export default function NavBar() {
  const loaderData = useLoaderData<{ user: any }>();

   console.log("NavBar loader data:", loaderData);
  console.log("User from loader data:", loaderData?.user);

  if (!loaderData?.user) {
    return (
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full flex items-center justify-between">
          <div className="text-red-500">Loading user data...</div>
        </div>
      </nav>
    );
  }

  const { user } = loaderData;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-lg font-semibold text-gray-800">TodoApp</span>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link 
            to={href("/")} 
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            My Tasks
          </Link>
          <Link
            to={href("/todos/new")}
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            Add Task
          </Link>
        </div>

        {/* Right side - User info and logout */}
        <div className="flex items-center space-x-4">
          {/* Simple User Info */}
          <div className="bg-gray-100 px-3 py-2 rounded-md">
            <span className="text-sm font-medium text-gray-800">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
          </div>

          {/* Logout Button */}
          <Form 
            action="/logout" 
            method="POST"
          >
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
    </nav>
  );
}