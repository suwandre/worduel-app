import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { apiClient } from "../api/client";
import { notifications } from "@mantine/notifications";
import type { User } from "../types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem("token", access_token);
      setToken(access_token);
      setUser(userData);
      notifications.show({
        title: "Welcome back!",
        message: `Logged in as ${userData.username}`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Login failed",
        message: "Invalid email or password",
        color: "red",
      });
      throw error;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        username,
        password,
      });
      const { access_token, user: userData } = response.data;
      localStorage.setItem("token", access_token);
      setToken(access_token);
      setUser(userData);
      notifications.show({
        title: "Account created!",
        message: `Welcome to Worduel, ${userData.username}!`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Registration failed",
        message: "Email may already be in use",
        color: "red",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    notifications.show({
      title: "Logged out",
      message: "See you next time!",
      color: "blue",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
