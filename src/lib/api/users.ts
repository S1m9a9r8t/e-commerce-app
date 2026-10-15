import { apiFetch } from "./client";
import type { User } from "@/types";

export function getUsers() {
  return apiFetch<User[]>("/users");
}

export function getUser(id: number) {
  return apiFetch<User>(`/users/${id}`);
}