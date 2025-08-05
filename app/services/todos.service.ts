import { apiRequest, withAuth, API_ENDPOINTS } from "./api";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  date_created: string;
  dueDate?: string;
  user_created: string;
}

export interface CreateTodoData {
  title: string;
  description: string;
  dueDate: string;
  status: "pending";
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: "pending" | "completed";
}

// Todo CRUD operations
export class TodosService {
  // Fetch user's todos
  static async getTodos(token: string): Promise<Todo[]> {
    try {
      const response = await apiRequest<Todo[]>(API_ENDPOINTS.TASKS.LIST, 
        withAuth(token, { method: "GET" })
      );
      return response.data || [];
    } catch (error) {
      return [];
    }
  }

  // Get one todo by ID
  static async getTodo(token: string, id: string | number): Promise<Todo | null> {
    try {
      const response = await apiRequest<Todo>(API_ENDPOINTS.TASKS.GET(id), 
        withAuth(token, { method: "GET" })
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Add new todo
  static async createTodo(token: string, todoData: CreateTodoData): Promise<Todo> {
    try {
      const response = await apiRequest<Todo>(API_ENDPOINTS.TASKS.CREATE, 
        withAuth(token, {
          method: "POST",
          body: JSON.stringify(todoData),
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update todo
  static async updateTodo(token: string, id: string | number, todoData: UpdateTodoData): Promise<Todo> {
    try {
      const response = await apiRequest<Todo>(API_ENDPOINTS.TASKS.UPDATE(id), 
        withAuth(token, {
          method: "PATCH",
          body: JSON.stringify(todoData),
        })
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mark as done
  static async markAsCompleted(token: string, id: string | number): Promise<Todo> {
    return this.updateTodo(token, id, { status: "completed" });
  }

  // Delete todo
  static async deleteTodo(token: string, id: string | number): Promise<void> {
    await apiRequest(API_ENDPOINTS.TASKS.DELETE(id), 
      withAuth(token, { method: "DELETE" })
    );
  }
} 