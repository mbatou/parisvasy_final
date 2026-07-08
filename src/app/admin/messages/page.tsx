"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Mail, MailOpen, Loader2 } from "lucide-react";

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  bookingReference: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await fetch(`/api/contact/${msg.id}`, { method: "PATCH" });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch {
        // Silently fail — mark-as-read is non-critical
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white font-light">
            Messages
          </h1>
          <p className="mt-1 text-sm text-white/40 font-light">
            Contact form submissions
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-white/[0.06] bg-pv-black-80 py-20 text-center">
          <Mail className="mx-auto h-8 w-8 text-white/20" />
          <p className="mt-3 text-sm text-white/30 font-light">
            No messages yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-0 border border-white/[0.06] lg:grid-cols-[360px_1fr]">
          {/* Message list */}
          <div className="max-h-[600px] overflow-y-auto border-b border-white/[0.06] lg:border-b-0 lg:border-r">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => markAsRead(msg)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-white/[0.06] px-4 py-4 text-left transition-colors last:border-b-0",
                  selected?.id === msg.id
                    ? "bg-gold/[0.06]"
                    : "hover:bg-white/[0.02]",
                  !msg.read && "border-l-2 border-l-gold"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm truncate",
                      msg.read
                        ? "text-white/50 font-light"
                        : "text-white font-medium"
                    )}
                  >
                    {msg.firstName} {msg.lastName}
                  </p>
                  {msg.read ? (
                    <MailOpen className="h-3 w-3 shrink-0 text-white/20" />
                  ) : (
                    <Mail className="h-3 w-3 shrink-0 text-gold" />
                  )}
                </div>
                <p className="text-xs text-white/30 truncate">{msg.subject}</p>
                <p className="text-[10px] text-white/20">
                  {formatDate(msg.createdAt)}
                </p>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="p-6 sm:p-8">
            {selected ? (
              <div>
                <div className="border-b border-white/[0.06] pb-5">
                  <h2 className="font-serif text-xl text-white font-light">
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm text-white/40 font-light">
                    From{" "}
                    <span className="text-white/60">
                      {selected.firstName} {selected.lastName}
                    </span>{" "}
                    &lt;
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-gold"
                    >
                      {selected.email}
                    </a>
                    &gt;
                  </p>
                  <p className="mt-0.5 text-xs text-white/20">
                    {formatDate(selected.createdAt)}
                  </p>
                  {selected.bookingReference && (
                    <p className="mt-2 text-xs text-gold/60">
                      Ref: {selected.bookingReference}
                    </p>
                  )}
                </div>
                <div className="mt-5 whitespace-pre-wrap text-[15px] font-light leading-[1.8] text-white/40">
                  {selected.message}
                </div>
                <div className="mt-8">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-block border border-gold/25 px-5 py-2 text-[11px] font-medium uppercase tracking-wide text-gold transition-all hover:bg-gold hover:text-pv-black"
                  >
                    Reply via email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center py-20">
                <p className="text-sm text-white/20 font-light">
                  Select a message to view
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
