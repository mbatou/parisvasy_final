"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Pencil, ShieldOff, ShieldCheck } from "lucide-react";
import type { UserRole } from "@/types";

const ROLE_BADGE_VARIANT: Record<UserRole, "gold" | "navy" | "blue" | "green" | "default"> = {
  super_admin: "gold",
  hotel_manager: "navy",
  finance_manager: "blue",
  front_desk: "green",
  customer: "default",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  hotel_manager: "Hotel Manager",
  finance_manager: "Finance Manager",
  front_desk: "Front Desk",
  customer: "Customer",
};

interface StaffMember {
  id: string;
  userId: string;
  hotelId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  hotel?: { id: string; name: string };
  email?: string;
  name?: string;
}

interface UsersPageClientProps {
  staff: StaffMember[];
  hotels: { id: string; name: string }[];
}

export function UsersPageClient({ staff, hotels }: UsersPageClientProps) {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredStaff = staff.filter((member) => {
    if (roleFilter && member.role !== roleFilter) return false;
    if (hotelFilter && member.hotelId !== hotelFilter) return false;
    if (statusFilter === "active" && !member.isActive) return false;
    if (statusFilter === "inactive" && member.isActive) return false;
    return true;
  });

  const handleToggleActive = async (staffId: string, currentlyActive: boolean) => {
    const res = await fetch(`/api/users/staff/${staffId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentlyActive }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-44">
          <Select
            label=""
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="hotel_manager">Hotel Manager</option>
            <option value="finance_manager">Finance Manager</option>
            <option value="front_desk">Front Desk</option>
          </Select>
        </div>
        <div className="w-48">
          <Select
            label=""
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          >
            <option value="">All Hotels</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-36">
          <Select
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Staff table */}
      <div className="border border-white/[0.06] bg-pv-black-80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-white/40">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <p className="font-light text-white">
                      {member.name || "---"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-white/60">
                      {member.email || "---"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE_VARIANT[member.role]}>
                      {ROLE_LABELS[member.role] || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">
                    {member.hotel?.name ?? "---"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "green" : "red"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${member.id}`}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-gold hover:bg-gold/10 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleActive(member.id, member.isActive)
                        }
                        className={
                          member.isActive
                            ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                            : "text-green-400 hover:bg-green-900/30 hover:text-green-300"
                        }
                      >
                        {member.isActive ? (
                          <>
                            <ShieldOff className="h-3.5 w-3.5" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Activate
                          </>
                        )}
                      </Button>
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
