"use client";

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

import * as authApi from "@/api/auth";
import type { LoginPayload, User } from "@/api/auth";
import { authStorage } from "@/lib/auth-storage";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = authStorage.getToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const profile = await authApi.getProfile();
        if (profile.role === "admin") {
          setUser(profile);
        } else {
          authStorage.clearToken();
        }
      } catch {
        authStorage.clearToken();
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, []);

  async function login(payload: LoginPayload) {
    const { token, user: loggedInUser } = await authApi.login(payload);

    if (loggedInUser.role !== "admin") {
      throw new Error("This account doesn't have admin access.");
    }

    authStorage.setToken(token);
    setUser(loggedInUser);
  }

  function logout() {
    authStorage.clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isBootstrapping, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
