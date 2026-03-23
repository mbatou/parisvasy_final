"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/types";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "hotel_manager", label: "Hotel Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "front_desk", label: "Front Desk" },
];

interface NewStaffClientProps {
  hotels: { id: string; name: string }[];
}

export function NewStaffClient({ hotels }: NewStaffClientProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("front_desk");
  const [hotelId, setHotelId] = useState(hotels[0]?.id ?? "");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!email.trim() || !email.includes("@"))
      errs.email = "Valid email is required";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!hotelId) errs.hotelId = "Select a hotel";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
          hotelId,
          isActive,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/users"), 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ email: data.error ?? "Failed to create staff member" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded bg-green-900/30 p-4 text-center">
        <p className="font-medium text-green-400">
          Staff member created successfully!
        </p>
        <p className="mt-1 text-sm text-green-400/60">
          Redirecting to users page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          placeholder="Jean"
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          placeholder="Dupont"
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="staff@parisvasy.com"
      />

      <div className="grid gap-4 grid-cols-2">
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Min 8 characters"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          placeholder="Confirm password"
        />
      </div>

      <Select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <Select
        label="Hotel Assignment"
        value={hotelId}
        onChange={(e) => setHotelId(e.target.value)}
        error={errors.hotelId}
      >
        {hotels.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-white/[0.06] text-gold focus:ring-gold/30"
        />
        <span className="text-sm font-light text-white/80">Active (can log in)</span>
      </label>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/users")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create Staff Member
        </Button>
      </div>
    </form>
  );
}
