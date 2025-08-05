import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export type Todo = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  date_created: string;
  dueDate?: string;
  user_created: string;
};

export type Filter = "all" | "pending" | "completed";

interface UseTodosProps {
  loaderData: {
    todos: Todo[];
    search?: string;
    filter?: string;
  };
}

export function useTodos({ loaderData }: UseTodosProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL parameters or loader data
  const [filter, setFilterState] = useState<Filter>(
    (loaderData.filter as Filter) || "all"
  );
  const [search, setSearchState] = useState(
    loaderData.search || ""
  );

  // Update URL when filter or search changes
  const updateURL = (newSearch: string, newFilter: Filter) => {
    const params = new URLSearchParams();
    
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }
    
    if (newFilter !== "all") {
      params.set("filter", newFilter);
    }
    
    const searchString = params.toString();
    const newURL = searchString ? `/?${searchString}` : "/";
    
    navigate(newURL, { replace: true });
  };

  // Debounced search update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL(search, filter);
    }, 500); // 500ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Immediate filter update
  const setFilter = (newFilter: Filter) => {
    setFilterState(newFilter);
    updateURL(search, newFilter);
  };

  // Search update (debounced via useEffect above)
  const setSearch = (newSearch: string) => {
    setSearchState(newSearch);
  };

  // Sort todos by creation date (newest first)
  const sortedTodos = [...(loaderData.todos || [])].sort((a, b) => {
    return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
  });

  return {
    filter,
    setFilter,
    search,
    setSearch,
    sortedTodos,
  };
}
