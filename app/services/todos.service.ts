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

// Todos service class
export class TodosService {
  // Get all todos for the authenticated user
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

  // Get a single todo by ID
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

  // Create a new todo
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

  // Update an existing todo
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

  // Mark todo as completed
  static async markAsCompleted(token: string, id: string | number): Promise<Todo> {
    return this.updateTodo(token, id, { status: "completed" });
  }

  // Delete a todo
  static async deleteTodo(token: string, id: string | number): Promise<void> {
    await apiRequest(API_ENDPOINTS.TASKS.DELETE(id), 
      withAuth(token, { method: "DELETE" })
    );
  }
} 