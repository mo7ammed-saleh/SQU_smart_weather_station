import { Router, Request, Response } from "express";
import { getPublicUser, updateUser } from "../services/userSettingsService.js";

const router = Router();

// GET /api/settings/user?id=1
router.get("/user", (req: Request, res: Response) => {
  const id = parseInt((req.query["id"] as string) ?? "1", 10);
  const user = getPublicUser(isNaN(id) ? 1 : id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

// PUT /api/settings/user
router.put("/user", (req: Request, res: Response) => {
  const { userId, username, currentPassword, newPassword } = req.body as {
    userId?: number;
    username?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const id = userId ?? 1;
  const result = updateUser(id, { username, currentPassword, newPassword });

  if (!result.success) {
    res.status(400).json({ error: result.message });
    return;
  }

  res.json({ message: result.message, user: result.user });
});

export default router;
