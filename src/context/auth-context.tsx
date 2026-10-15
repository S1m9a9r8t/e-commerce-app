"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getProfile,
  login as loginRequest,
  refreshAccessToken,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { LoginRequest, User } from "@/types";

const STORAGE_KEY = "nexus-auth";

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  accessToken: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredTokens>;
    if (
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    ) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function saveTokens(tokens: StoredTokens) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // Storage is blocked: the user stays logged in until they close the tab
  }
}

function clearTokens() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // When the site opens, check if the visitor was already logged in
  useEffect(() => {
    let cancelled = false;

    function finishLoggedOut() {
      if (cancelled) return;
      setUser(null);
      setAccessToken(null);
      setStatus("unauthenticated");
    }

    async function restore() {
      const stored = readTokens();
      if (!stored) {
        finishLoggedOut();
        return;
      }

      try {
        const profile = await getProfile(stored.accessToken);
        if (cancelled) return;
        setUser(profile);
        setAccessToken(stored.accessToken);
        setStatus("authenticated");
      } catch (e) {
        const authFailed =
          e instanceof ApiError && (e.status === 401 || e.status === 403);

        // The access token expired: try to get a new one
        if (authFailed) {
          try {
            const fresh = await refreshAccessToken(stored.refreshToken);
            const tokens = {
              accessToken: fresh.access_token,
              refreshToken: fresh.refresh_token,
            };
            const profile = await getProfile(tokens.accessToken);
            if (cancelled) return;
            saveTokens(tokens);
            setUser(profile);
            setAccessToken(tokens.accessToken);
            setStatus("authenticated");
            return;
          } catch {
            clearTokens();
          }
        }

        // For a network error we keep the saved tokens and try again later
        finishLoggedOut();
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const tokens = await loginRequest(credentials);
    const profile = await getProfile(tokens.access_token);
    saveTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    setUser(profile);
    setAccessToken(tokens.access_token);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAccessToken(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, accessToken, login, logout }),
    [user, status, accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}