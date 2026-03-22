"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const email = `${username.toLowerCase().trim()}@parisvasy.com`;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      const role = user?.user_metadata?.role;
      const isStaff =
        role === "super_admin" ||
        role === "hotel_manager" ||
        role === "finance_manager" ||
        role === "front_desk";

      if (redirect) {
        router.push(redirect);
      } else if (isStaff) {
        router.push("/admin");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center font-serif text-2xl text-white font-light">
        Welcome back
      </h2>
      <p className="mt-2 text-center text-sm text-white/40 font-light">
        Sign in to your account
      </p>

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Input
          label="Username"
          type="text"
          placeholder="your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40 font-light">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-gold hover:text-gold-light"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8 text-white/40">Loading...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
