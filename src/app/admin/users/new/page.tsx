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

export default function NewUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("front_desk");
  const [hotelId, setHotelId] = useState("");
  const [hotels, setHotels] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Fetch hotels on mount
  if (!loaded) {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        if (data.length > 0 && !hotelId) {
          setHotelId(data[0].id);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!email.trim() || !email.includes("@"))
      errs.email = "Valid email is required";
    if (!hotelId) errs.hotelId = "Select a hotel";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, hotelId }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/users"), 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ email: data.error ?? "Failed to invite user" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-500 font-serif">
          Invite Staff Member
        </h1>
        <p className="mt-1 text-sm text-navy-300 font-sans">
          Send an invitation to a new staff member.
        </p>
      </div>

      <div className="mx-auto max-w-lg rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="font-medium text-green-800">
              Invitation sent successfully!
            </p>
            <p className="mt-1 text-sm text-green-600">
              Redirecting to users page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="staff@parisvasy.com"
            />

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

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin/users")}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Send Invitation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
