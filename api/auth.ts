import { apiClient } from "@/lib/api-client";

export type Role = "customer" | "admin";

export type User = {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>("/auth/profile");
  return data.user;
}

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ users: User[] }>("/auth/users");
  return data.users;
}
