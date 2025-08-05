import { Link, href, Form, useLoaderData } from "react-router";

export default function NavBar() {
  const loaderData = useLoaderData<{ user: any }>();

  if (!loaderData?.user) {
    return (
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="w-full flex items-center justify-between">
          <div className="text-slate-500">Loading...</div>
        </div>
      </nav>
    );
  }

  const { user } = loaderData;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full text-white flex items-center justify-center font-bold shadow-lg text-sm sm:text-base">
            T
          </div>
          <span className="text-base sm:text-lg font-semibold text-slate-900">TodoApp</span>
        </div>

        {/* Right side - My Tasks, User info and logout */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* My Tasks Link */}
          <Link 
            to={href("/")} 
            className="hidden sm:block text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200"
          >
            My Tasks
          </Link>

          {/* User Info - Mobile and Desktop */}
          <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-50 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div className="text-xs hidden sm:block">
              <div className="font-medium text-slate-900">{user.first_name} {user.last_name}</div>
              <div className="text-slate-500">{user.email}</div>
            </div>
            {/* Mobile: Show just first name */}
            <div className="text-xs sm:hidden">
              <div className="font-medium text-slate-900">{user.first_name}</div>
            </div>
          </div>

          {/* Logout Button */}
          <Form action="/logout" method="POST">
            <button
              type="submit"
              className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-red-600 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[28px] sm:min-h-[36px] inline-flex items-center justify-center"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
    </nav>
  );
}