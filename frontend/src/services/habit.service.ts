import { apiRequest } from "./api";

export interface Habit {
  _id: string;
  userId: string;
  name: string;
  color?: string;
  startDate: string;
  completedDates: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHabitData {
  name: string;
  color?: string;
  startDate: string;
}

export interface UpdateHabitData {
  name?: string;
  color?: string;
}

export const habitService = {
  async getAll(): Promise<Habit[]> {
    const response = await apiRequest<{ habits: Habit[] }>("/api/habits");
    return response.habits;
  },

  async create(data: CreateHabitData): Promise<Habit> {
    const response = await apiRequest<{ message: string; habit: Habit }>(
      "/api/habits",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return response.habit;
  },

  async update(id: string, data: UpdateHabitData): Promise<Habit> {
    const response = await apiRequest<{ message: string; habit: Habit }>(
      `/api/habits/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    return response.habit;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<{ message: string }>(`/api/habits/${id}`, {
      method: "DELETE",
    });
  },

  async toggleCompletion(id: string, date: string): Promise<Habit> {
    const response = await apiRequest<{ message: string; habit: Habit }>(
      `/api/habits/${id}/toggle`,
      {
        method: "PATCH",
        body: JSON.stringify({ date }),
      },
    );

    return response.habit;
  },
};
