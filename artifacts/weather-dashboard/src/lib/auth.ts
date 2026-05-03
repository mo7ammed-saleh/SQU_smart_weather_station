import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userId: number;
  username: string;
  login: (userId: number, username: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem("session") === "true",
  userId: parseInt(localStorage.getItem("userId") ?? "1", 10),
  username: localStorage.getItem("username") ?? "admin",
  login: (userId: number, username: string) => {
    localStorage.setItem("session", "true");
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("username", username);
    set({ isAuthenticated: true, userId, username });
  },
  logout: () => {
    localStorage.removeItem("session");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    set({ isAuthenticated: false, userId: 1, username: "" });
  },
}));
