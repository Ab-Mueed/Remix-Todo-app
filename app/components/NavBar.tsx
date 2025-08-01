import { Link, href } from "react-router"

export default function NavBar() {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold">
                        T
                    </div>
                    <span className="text-lg font-semibold text-gray-800">TodoApp</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link to={href("/")} className="text-gray-600 hover:text-blue-600 text-sm sm:text-base">
                        Home
                    </Link>
                    <Link
                        to={href("/todos/new")}
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">New Todo</span>
                        <span className="sm:hidden">+ New</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}