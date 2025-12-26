"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard/1");
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl text-white">
      <CardContent className="px-8 pt-12 pb-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-white/90">Email</Label>
            <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-white/30">
              <Mail className="h-5 w-5 text-white/60" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-white/50 text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-white/90">Password</Label>
            <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-white/30">
              <Lock className="h-5 w-5 text-white/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-white/50 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-white/80">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-sm text-red-400 hover:underline">
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button disabled={loading} type="submit" variant="default" className="w-full h-12 text-base font-medium rounded-lg">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Social login buttons removed per request */}

        {/* Signup */}
        <p className="text-center text-sm text-white/70 mt-4">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-red-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
