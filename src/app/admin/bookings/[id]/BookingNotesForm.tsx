"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface BookingNotesFormProps {
  bookingId: string;
  initialNotes: string;
}

export function BookingNotesForm({
  bookingId,
  initialNotes,
}: BookingNotesFormProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-white/[0.06] bg-pv-black-80 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        placeholder="Add notes about this booking..."
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} loading={saving}>
          Save Notes
        </Button>
        {saved && (
          <span className="text-xs font-medium text-green-600">Saved!</span>
        )}
      </div>
    </div>
  );
}
