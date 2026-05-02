import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4 relative z-10"
      >
        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-4 items-center text-center pb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
              <Activity className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Weather Station</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sultan Qaboos University Monitoring System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter your username" className="pl-10 bg-white/50 focus:bg-white transition-colors" {...field} />
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
                      <FormLabel className="text-foreground/80">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="Enter your password" className="pl-10 bg-white/50 focus:bg-white transition-colors" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-4 h-11 text-base font-medium shadow-md transition-all hover:shadow-lg" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
