import { Link, href } from "react-router"

export default function NavBar() {
    return (
        <nav className="w-md flex items-center justify-around px-8 py-4 mx-auto">
            <Link to={href("/")} className="hover:underline">Home</Link>
            <Link to={href("/todos/new")} className="hover:underline">New To-Do</Link>
        </nav>
    )
}