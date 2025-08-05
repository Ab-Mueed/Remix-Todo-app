import { Link, href } from "react-router";
import Button from "./ui/Button";
import Input from "./ui/Input";
import type { Filter } from "~/hooks/useTodos";

interface SidebarProps {
  search: string;
  setSearch: (search: string) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

export default function Sidebar({ search, setSearch, filter, setFilter }: SidebarProps) {
  const filterOptions = [
    { key: "all", label: "All Tasks", icon: "📋" },
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "completed", label: "Completed", icon: "✅" },
  ] as const;

  return (
    <div className="hidden lg:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Search & Filter</h2>
        
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            id="search-todos"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            className="text-sm"
          />
        </div>

        {/* New Task Button */}
        <Link to={href("/todos/new")}>
          <Button variant="primary" fullWidth size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </Link>
      </div>

      {/* Filter Options */}
      <div className="flex-1 p-4">
        <h3 className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wide">Filter by Status</h3>
        <div className="space-y-1">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key as Filter)}
              className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 text-sm ${
                filter === option.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="text-sm">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          Stay organized and productive
        </div>
      </div>
    </div>
  );
}