import { apiFetch } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";

export function login(credentials: LoginRequest) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getProfile(accessToken: string) {
  return apiFetch<User>("/auth/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function refreshAccessToken(refreshToken: string) {
  return apiFetch<LoginResponse>("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function isEmailAvailable(email: string) {
  return apiFetch<{ isAvailable: boolean }>("/users/is-available", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function registerUser(data: RegisterRequest) {
  return apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}