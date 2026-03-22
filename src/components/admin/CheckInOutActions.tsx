"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogIn, LogOut, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/types";

interface CheckInOutActionsProps {
  booking: Booking;
  onAction: (action: "check_in" | "check_out" | "cancel") => void;
}

export function CheckInOutActions({
  booking,
  onAction,
}: CheckInOutActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = (action: "check_in" | "check_out" | "cancel") => {
    setLoading(true);
    onAction(action);
  };

  return (
    <div className="space-y-4">
      {/* Timestamps */}
      {booking.checkedInAt && (
        <div className="rounded bg-green-900/30 px-4 py-3 text-sm">
          <span className="font-light text-green-400">Checked in:</span>{" "}
          <span className="font-light text-green-300">
            {formatDate(booking.checkedInAt)}
          </span>
        </div>
      )}
      {booking.checkedOutAt && (
        <div className="rounded bg-blue-900/30 px-4 py-3 text-sm">
          <span className="font-light text-blue-400">Checked out:</span>{" "}
          <span className="font-light text-blue-300">
            {formatDate(booking.checkedOutAt)}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {booking.status === "confirmed" && (
          <Button
            variant="primary"
            onClick={() => handleAction("check_in")}
            loading={loading}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-300"
          >
            <LogIn className="h-4 w-4" />
            Check In
          </Button>
        )}

        {booking.status === "checked_in" && (
          <Button
            variant="primary"
            onClick={() => handleAction("check_out")}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-300"
          >
            <LogOut className="h-4 w-4" />
            Check Out
          </Button>
        )}

        {(booking.status === "pending" || booking.status === "confirmed") && (
          <>
            {!confirming ? (
              <Button
                variant="destructive"
                onClick={() => setConfirming(true)}
              >
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded border border-red-500/30 bg-red-900/30 px-4 py-2">
                <span className="text-sm font-light text-red-400">
                  Are you sure?
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleAction("cancel")}
                  loading={loading}
                >
                  Yes, cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirming(false)}
                >
                  No
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
