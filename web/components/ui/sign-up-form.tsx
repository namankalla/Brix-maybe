"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ConfirmEmailPopup } from "@/components/ui/confirm-email-popup"

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      // If email confirmation is disabled, a session may be created immediately
      const session = data?.session;
      if (session) {
        router.push("/dashboard/1");
        return;
      }
      setShowConfirm(true);
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl text-white">
      <CardContent className="px-8 pt-12 pb-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-white/90">Full Name</Label>
          <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-white/30">
            <User className="h-5 w-5 text-white/60" />
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-white/50 text-white"
            />
          </div>
        </div>

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
              placeholder="Create a password"
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

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Submit */}
        <Button disabled={loading} type="submit" variant="default" className="w-full h-12 text-base font-medium rounded-lg">
          {loading ? "Creating..." : "Create Account"}
        </Button>

        {/* Switch to Sign In */}
        <p className="text-center text-sm text-white/70 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-red-400 hover:underline">Sign In</Link>
        </p>
        </form>

        <ConfirmEmailPopup open={showConfirm} onClose={() => setShowConfirm(false)} email={email} />
      </CardContent>
    </Card>
  )
}
