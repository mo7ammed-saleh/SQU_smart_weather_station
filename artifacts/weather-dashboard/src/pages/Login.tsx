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
        <Card className="border-white/20 shadow-2xl bg-white/10 backdrop-blur-xl">
          <CardHeader className="space-y-5 items-center text-center pb-6 pt-8">
            {/* Company logo */}
            <div className="flex justify-center">
              <img
                src="/company-logo.png"
                alt="iLab Marine"
                className="h-20 object-contain drop-shadow-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Colorful gradient icon */}
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)",
                boxShadow: "0 8px 32px rgba(14,165,233,0.5)",
              }}
            >
              <Activity className="h-8 w-8 text-white drop-shadow" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-white leading-snug">
                Smart Weather Station
                <br />
                <span className="text-base font-semibold text-cyan-200">Dashboard Login</span>
              </h1>
              <p className="text-sm text-white/70">
                Sultan Qaboos University — iLab Marine
              </p>
            </div>
          </CardHeader>

          <CardContent className="pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-medium">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                          <Input
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="pl-10 bg-white/15 border-white/25 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-cyan-300 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pl-10 bg-white/15 border-white/25 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-cyan-300 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-2 h-11 text-base font-semibold shadow-lg transition-all hover:shadow-cyan-500/40 hover:scale-[1.01]"
                  style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/40">
          SQU Smart Weather Station Monitoring System © 2026
        </p>
      </motion.div>
    </div>
  );
}
