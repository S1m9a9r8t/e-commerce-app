import { apiFetch } from "./client";
import type { User } from "@/types";


function toSafeUser(raw: User): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    role: raw.role,
    avatar: raw.avatar,
    creationAt: raw.creationAt,
    updatedAt: raw.updatedAt,
  };
}

export async function getUsers(options?: RequestInit) {
  const data = await apiFetch<User[]>("/users", options);
  return Array.isArray(data) ? data.map(toSafeUser) : [];
}

export async function getUser(id: number, options?: RequestInit) {
  const data = await apiFetch<User>(`/users/${id}`, options);
  return toSafeUser(data);
}