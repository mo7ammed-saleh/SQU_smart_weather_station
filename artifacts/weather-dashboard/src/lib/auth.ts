import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem("session") === "true",
  login: () => {
    localStorage.setItem("session", "true");
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("session");
    set({ isAuthenticated: false });
  },
}));
