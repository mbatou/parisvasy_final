"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username.toLowerCase().trim(),
            role: "customer",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Create Guest record via API
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: data.user?.id,
          email,
          firstName,
          lastName,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Failed to create guest profile.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center font-serif text-2xl text-white font-light">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-white/40 font-light">
        Join PARISVASY and start booking experiences
      </p>

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            type="text"
            placeholder="Jean"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            type="text"
            placeholder="Dupont"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40 font-light">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gold hover:text-gold-light"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
