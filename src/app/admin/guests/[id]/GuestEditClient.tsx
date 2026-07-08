"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface GuestEditClientProps {
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    nationality: string | null;
    idNumber: string | null;
    notes: string | null;
    authUserId: string | null;
  };
}

export function GuestEditClient({ guest }: GuestEditClientProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(guest.firstName);
  const [lastName, setLastName] = useState(guest.lastName);
  const [phone, setPhone] = useState(guest.phone ?? "");
  const [nationality, setNationality] = useState(guest.nationality ?? "");
  const [idNumber, setIdNumber] = useState(guest.idNumber ?? "");
  const [notes, setNotes] = useState(guest.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/guests/${guest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phone || null,
          nationality: nationality || null,
          idNumber: idNumber || null,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Email - read only if linked to auth */}
      <div>
        <label className="text-sm font-light text-white/80">Email</label>
        <p className="mt-1.5 rounded border border-white/[0.06] bg-pv-black-90 px-3 py-2.5 text-sm font-light text-white/40">
          {guest.email}
          {guest.authUserId && (
            <span className="ml-2 text-xs text-gold">(linked to account)</span>
          )}
        </p>
      </div>

      <Input
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+33 6 00 00 00 00"
      />

      <div className="grid gap-4 grid-cols-2">
        <Input
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="French"
        />
        <Input
          label="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Passport or ID"
        />
      </div>

      <div>
        <label className="text-sm font-light text-white/80">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm font-light text-white/80 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Notes about this guest..."
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
        {saved && (
          <span className="text-xs font-medium text-green-400">Saved!</span>
        )}
      </div>
    </div>
  );
}
