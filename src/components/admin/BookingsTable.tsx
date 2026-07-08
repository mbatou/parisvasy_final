"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Eye,
  LogIn,
  LogOut,
  XCircle,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { STATUS_LABELS } from "@/types";

type SortField =
  | "reference"
  | "checkIn"
  | "checkOut"
  | "nights"
  | "roomTotal"
  | "status";
type SortDirection = "asc" | "desc";

interface BookingsTableProps {
  bookings: Booking[];
  onAction: (
    action: "view" | "check_in" | "check_out" | "cancel",
    bookingId: string
  ) => void;
}

export function BookingsTable({ bookings, onAction }: BookingsTableProps) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("checkIn");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-white/20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-gold" />
    ) : (
      <ChevronDown className="h-3 w-3 text-gold" />
    );
  };

  const filtered = bookings
    .filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFrom && new Date(b.checkIn) < new Date(dateFrom)) return false;
      if (dateTo && new Date(b.checkOut) > new Date(dateTo)) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "reference":
          return a.reference.localeCompare(b.reference) * dir;
        case "checkIn":
          return (new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()) * dir;
        case "checkOut":
          return (new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()) * dir;
        case "nights":
          return (a.nights - b.nights) * dir;
        case "roomTotal":
          return (Number(a.roomTotal) - Number(b.roomTotal)) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as BookingStatus | "all")
          }
        >
          <option value="all" className="bg-pv-black-80">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key} className="bg-pv-black-80">
              {label}
            </option>
          ))}
        </Select>

        <div className="flex flex-col gap-1.5">
          <label className="micro-label text-gold/70">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-10 border border-white/[0.08] bg-pv-black-80 px-3 text-sm text-white font-light focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="micro-label text-gold/70">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-10 border border-white/[0.08] bg-pv-black-80 px-3 text-sm text-white font-light focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
          />
        </div>

        {(statusFilter !== "all" || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setDateFrom("");
              setDateTo("");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border border-white/[0.06] bg-pv-black-80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("reference")}>
                  Reference <SortIcon field="reference" />
                </button>
              </TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("checkIn")}>
                  Check-in <SortIcon field="checkIn" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("checkOut")}>
                  Check-out <SortIcon field="checkOut" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("nights")}>
                  Nights <SortIcon field="nights" />
                </button>
              </TableHead>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("roomTotal")}>
                  Total <SortIcon field="roomTotal" />
                </button>
              </TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>
                <button type="button" className="flex items-center gap-1" onClick={() => handleSort("status")}>
                  Status <SortIcon field="status" />
                </button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-12 text-center text-white/30">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs text-gold">{booking.reference}</TableCell>
                  <TableCell>
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName}`
                      : "-"}
                  </TableCell>
                  <TableCell>{booking.experience?.title ?? "-"}</TableCell>
                  <TableCell>{booking.room?.name ?? "-"}</TableCell>
                  <TableCell>{formatDate(booking.checkIn)}</TableCell>
                  <TableCell>{formatDate(booking.checkOut)}</TableCell>
                  <TableCell>{booking.nights}</TableCell>
                  <TableCell className="text-gold">{formatCurrency(Number(booking.roomTotal))}</TableCell>
                  <TableCell>
                    <Badge variant={booking.warrantyCollected ? "green" : "yellow"}>
                      {booking.warrantyCollected ? "Collected" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === "confirmed" ? "blue" :
                      booking.status === "checked_in" ? "green" :
                      booking.status === "cancelled" || booking.status === "no_show" ? "red" :
                      booking.status === "pending" ? "yellow" : "default"
                    }>
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="View"
                        onClick={() => onAction("view", booking.id)}
                        className="p-1.5 text-white/30 transition-colors hover:text-gold"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          title="Check in"
                          onClick={() => onAction("check_in", booking.id)}
                          className="p-1.5 text-green-400/60 transition-colors hover:text-green-400"
                        >
                          <LogIn className="h-4 w-4" />
                        </button>
                      )}
                      {booking.status === "checked_in" && (
                        <button
                          type="button"
                          title="Check out"
                          onClick={() => onAction("check_out", booking.id)}
                          className="p-1.5 text-blue-400/60 transition-colors hover:text-blue-400"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                      {(booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <button
                          type="button"
                          title="Cancel"
                          onClick={() => onAction("cancel", booking.id)}
                          className="p-1.5 text-red-400/60 transition-colors hover:text-red-400"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
