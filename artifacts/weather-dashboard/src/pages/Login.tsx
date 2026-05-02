import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      if (values.username === "admin" && values.password === "admin123") {
        login();
        setLocation("/");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient-slow"
        style={{
          background: "linear-gradient(135deg, #0c4a6e, #075985, #0e7490, #0369a1, #164e63, #0c4a6e)",
        }}
      />

      {/* Animated blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-300/20 blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[35%] h-[35%] rounded-full bg-blue-300/15 blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        {/* White card */}
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="space-y-4 items-center text-center pb-4 pt-8">
            {/* Company logo */}
            <div className="flex justify-center">
              <img
                src="/company-logo.png"
                alt="iLab Marine"
                className="h-20 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Colorful gradient icon */}
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)",
                boxShadow: "0 8px 24px rgba(14,165,233,0.4)",
              }}
            >
              <Activity className="h-7 w-7 text-white drop-shadow" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-800 leading-snug">
                Smart Weather Station
              </h1>
              <p className="text-base font-semibold text-primary">Dashboard Login</p>
            </div>
          </CardHeader>

          <CardContent className="pb-8 px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 font-medium">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="pl-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pl-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-2 h-11 text-base font-semibold shadow-md transition-all hover:shadow-cyan-400/40 hover:scale-[1.01]"
                  style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/60">
          Sultan Qaboos University — iLab Marine | © 2026
        </p>
      </motion.div>
    </div>
  );
}
