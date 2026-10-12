import { apiRequest } from "./api";

export interface Task {
  _id: string;
  userId: string;
  title: string;
  completed: boolean;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  title: string;
  date: string;
  completed?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  completed?: boolean;
  date?: string;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await apiRequest<{ tasks: Task[] }>("/api/tasks");
    return response.tasks;
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await apiRequest<{
      message: string;
      task: Task;
    }>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.task;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiRequest<{ task: Task }>(
      `/api/tasks/${id}`,
    );

    return response.task;
  },

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await apiRequest<{
      message: string;
      task: Task;
    }>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return response.task;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};