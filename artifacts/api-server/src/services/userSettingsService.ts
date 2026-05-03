import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.resolve(__dirname, "../data/users.json");

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  updatedAt: string;
}

interface UsersFile {
  users: User[];
}

function readUsersFile(): UsersFile {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(raw) as UsersFile;
    }
  } catch {}
  return { users: [{ id: 1, username: "admin", password: "admin123", role: "admin", updatedAt: new Date().toISOString() }] };
}

function writeUsersFile(data: UsersFile): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function findUserByUsername(username: string): User | undefined {
  const data = readUsersFile();
  return data.users.find((u) => u.username === username);
}

export function validateLogin(username: string, password: string): User | null {
  const user = findUserByUsername(username);
  if (!user || user.password !== password) return null;
  return user;
}

export function getPublicUser(userId: number): Omit<User, "password"> | null {
  const data = readUsersFile();
  const user = data.users.find((u) => u.id === userId);
  if (!user) return null;
  const { password: _p, ...pub } = user;
  return pub;
}

export function updateUser(
  userId: number,
  updates: { username?: string; currentPassword?: string; newPassword?: string }
): { success: boolean; message: string; user?: Omit<User, "password"> } {
  const data = readUsersFile();
  const idx = data.users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false, message: "User not found" };

  const user = data.users[idx]!;

  if (updates.newPassword !== undefined) {
    if (!updates.currentPassword) return { success: false, message: "Current password is required" };
    if (user.password !== updates.currentPassword) return { success: false, message: "Current password is incorrect" };
    if (!updates.newPassword.trim()) return { success: false, message: "New password must not be empty" };
    user.password = updates.newPassword;
  }

  if (updates.username !== undefined) {
    if (!updates.username.trim()) return { success: false, message: "Username must not be empty" };
    const taken = data.users.find((u) => u.username === updates.username && u.id !== userId);
    if (taken) return { success: false, message: "Username already taken" };
    user.username = updates.username.trim();
  }

  user.updatedAt = new Date().toISOString();
  data.users[idx] = user;
  writeUsersFile(data);

  const { password: _p, ...pub } = user;
  return { success: true, message: "Settings updated successfully", user: pub };
}
