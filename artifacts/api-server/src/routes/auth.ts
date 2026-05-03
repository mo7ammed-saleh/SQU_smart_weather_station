import { Router, Request, Response } from "express";
import { validateLogin } from "../services/userSettingsService.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const user = validateLogin(username.trim(), password);
  if (!user) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const { password: _p, ...pub } = user;
  res.json({ success: true, user: pub });
});

export default router;
