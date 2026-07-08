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

interface EditStaffClientProps {
  staffId: string;
  assignment: {
    userId: string;
    role: UserRole;
    hotelId: string;
    isActive: boolean;
  };
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  } | null;
  hotels: { id: string; name: string }[];
}

export function EditStaffClient({
  staffId,
  assignment,
  guest,
  hotels,
}: EditStaffClientProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(guest?.firstName ?? "");
  const [lastName, setLastName] = useState(guest?.lastName ?? "");
  const [role, setRole] = useState<UserRole>(assignment.role);
  const [hotelId, setHotelId] = useState(assignment.hotelId);
  const [isActive, setIsActive] = useState(assignment.isActive);
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isSuperAdmin = assignment.role === "super_admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (newPassword && newPassword.length < 8)
      errs.newPassword = "Password must be at least 8 characters";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch(`/api/users/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          role: isSuperAdmin ? undefined : role,
          hotelId: isSuperAdmin ? undefined : hotelId,
          isActive,
          ...(newPassword ? { newPassword } : {}),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/users");
          router.refresh();
        }, 1000);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error ?? "Failed to update staff member" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded bg-green-900/30 p-4 text-center">
        <p className="font-medium text-green-400">Updated successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="rounded bg-red-900/30 p-3 text-sm text-red-400">
          {errors.form}
        </div>
      )}

      <div className="grid gap-4 grid-cols-2">
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
        />
      </div>

      {/* Email - read only */}
      <div>
        <label className="text-sm font-light text-white/80">Email</label>
        <p className="mt-1.5 rounded border border-white/[0.06] bg-pv-black-90 px-3 py-2.5 text-sm font-light text-white/40">
          {guest?.email ?? "---"}
        </p>
      </div>

      {!isSuperAdmin && (
        <>
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
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </Select>
        </>
      )}

      {isSuperAdmin && (
        <div className="rounded bg-gold/10 p-3 text-sm text-gold">
          Super Admin role cannot be changed.
        </div>
      )}

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-white/[0.06] text-gold focus:ring-gold/30"
        />
        <span className="text-sm font-light text-white/80">
          Active (can log in)
        </span>
      </label>

      {/* Password reset */}
      <div className="rounded border border-white/[0.06] p-4 space-y-3">
        <p className="text-sm font-light text-white/60">Reset Password</p>
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          placeholder="Leave blank to keep current"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/users")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
