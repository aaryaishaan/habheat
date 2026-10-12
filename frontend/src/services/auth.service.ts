import { apiRequest } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  message: string;
  user: User;
}

interface MessageResponse {
  message: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  register(credentials: RegisterCredentials) {
    return apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  login(credentials: LoginCredentials) {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return apiRequest<MessageResponse>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getMe() {
    const response = await apiRequest<{ user: User }>("/api/auth/me");
    return response.user;
  },

  async updateProfile(updates: { name?: string; email?: string }) {
    const response = await apiRequest<AuthResponse>("/api/auth/update", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });

    return response.user;
  },
};