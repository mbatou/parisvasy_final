"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";

const SUBJECTS = [
  "Booking inquiry",
  "Partnership proposal",
  "Technical issue",
  "Cancellation / modification",
  "Press / media",
  "Other",
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          subject: data.get("subject"),
          bookingReference: data.get("bookingReference") || null,
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      setSuccess(true);
      form.reset();

      // Reset success state after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-2 block w-full border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors placeholder:text-white/20 focus:border-gold"
            placeholder="Jean"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-2 block w-full border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors placeholder:text-white/20 focus:border-gold"
            placeholder="Dupont"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 block w-full border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors placeholder:text-white/20 focus:border-gold"
          placeholder="jean@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="mt-2 block w-full border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors focus:border-gold [&>option]:bg-pv-black [&>option]:text-white"
          defaultValue=""
        >
          <option value="" disabled className="text-white/20">
            Select a subject...
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Booking reference */}
      <div>
        <label
          htmlFor="bookingReference"
          className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
        >
          Booking reference{" "}
          <span className="normal-case tracking-normal text-white/20">
            (optional)
          </span>
        </label>
        <input
          id="bookingReference"
          name="bookingReference"
          type="text"
          className="mt-2 block w-full border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors placeholder:text-white/20 focus:border-gold"
          placeholder="PVS-2026-XXXX"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-[11px] font-medium uppercase tracking-[2px] text-gold"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 block w-full resize-y border border-white/[0.1] bg-transparent px-4 py-3 text-sm text-white font-light outline-none transition-colors placeholder:text-white/20 focus:border-gold"
          placeholder="How can we help you?"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-vermillion font-light">{error}</p>
      )}

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading || success}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-8 py-3 text-[11px] font-medium uppercase tracking-wide transition-colors",
            success
              ? "bg-green-600 text-white"
              : "bg-gold text-pv-black hover:bg-gold-light",
            (loading || success) && "opacity-90 cursor-not-allowed"
          )}
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {success && <Check className="h-3.5 w-3.5" />}
          {success ? "Message sent" : loading ? "Sending..." : "Send message"}
        </button>
        <p className="text-[11px] text-white/20 font-light">
          By submitting, you agree to our{" "}
          <Link
            href="/privacy"
            className="text-gold/60 transition-colors hover:text-gold"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </form>
  );
}
