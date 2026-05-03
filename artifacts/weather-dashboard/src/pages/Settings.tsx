import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Save, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const usernameSchema = z.object({
  username: z.string().min(1, "Username must not be empty"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(1, "New password must not be empty"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function Settings() {
  const { userId, username: storedUsername } = useAuth();
  const { toast } = useToast();
  const [displayUsername, setDisplayUsername] = useState(storedUsername);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setDisplayUsername(storedUsername);
  }, [storedUsername]);

  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: storedUsername },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function handleUsernameSubmit(values: z.infer<typeof usernameSchema>) {
    setSavingUsername(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/settings/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username: values.username }),
      });
      const data = await res.json() as { message?: string; user?: { username: string }; error?: string };
      if (res.ok && data.user) {
        localStorage.setItem("username", data.user.username);
        setDisplayUsername(data.user.username);
        toast({ title: "Username updated", description: data.message ?? "Username saved successfully." });
      } else {
        toast({ title: "Update failed", description: data.error ?? "Could not update username.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Connection error", description: "Could not reach the server.", variant: "destructive" });
    }
    setSavingUsername(false);
  }

  async function handlePasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setSavingPassword(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/settings/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword: values.currentPassword, newPassword: values.newPassword }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        passwordForm.reset();
        toast({ title: "Password updated", description: data.message ?? "Password changed successfully." });
      } else {
        toast({ title: "Update failed", description: data.error ?? "Could not update password.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Connection error", description: "Could not reach the server.", variant: "destructive" });
    }
    setSavingPassword(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-2xl">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account credentials.</p>
      </div>

      {/* Current account info */}
      <Card className="border-border">
        <CardContent className="pt-5 pb-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}>
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{displayUsername}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </CardContent>
      </Card>

      {/* Change Username */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Change Username
          </CardTitle>
          <CardDescription>Update your login username.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)} className="space-y-4">
              <FormField
                control={usernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={savingUsername}
                className="gap-2" style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}>
                <Save className="h-4 w-4" />
                {savingUsername ? "Saving..." : "Save Username"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Enter your current password, then set a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={savingPassword}
                className="gap-2" style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}>
                <Save className="h-4 w-4" />
                {savingPassword ? "Saving..." : "Save Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground border border-border rounded-md px-4 py-3 bg-muted/30">
        Credentials are stored in <code className="text-xs font-mono">backend/data/users.json</code>.
        This is simple JSON authentication. In a future version this can be replaced with a real database and hashed passwords.
      </p>
    </motion.div>
  );
}
