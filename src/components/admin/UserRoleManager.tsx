"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { UserPlus, ShieldOff } from "lucide-react";
import type { UserRole } from "@/types";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "hotel_manager", label: "Hotel Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "front_desk", label: "Front Desk" },
];

const ROLE_BADGE_VARIANT: Record<UserRole, "vermillion" | "navy" | "blue" | "green" | "default"> = {
  super_admin: "vermillion",
  hotel_manager: "navy",
  finance_manager: "blue",
  front_desk: "green",
  customer: "default",
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

interface UserRoleManagerProps {
  staff: StaffMember[];
  hotels: { id: string; name: string }[];
  onInvite: (data: { email: string; role: UserRole; hotelId: string }) => void;
  onDeactivate: (staffId: string) => void;
}

export function UserRoleManager({
  staff,
  hotels,
  onInvite,
  onDeactivate,
}: UserRoleManagerProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("front_desk");
  const [hotelId, setHotelId] = useState(hotels[0]?.id ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inviting, setInviting] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!email.trim() || !email.includes("@")) errs.email = "Valid email is required";
    if (!hotelId) errs.hotelId = "Select a hotel";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setInviting(true);
    onInvite({ email, role, hotelId });
    setEmail("");
    setInviting(false);
  };

  return (
    <div className="space-y-8">
      {/* Invite form */}
      <div className="rounded-xl border border-navy-100 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-navy-500">
          Invite Staff Member
        </h3>
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="staff@parisvasy.com"
            />
          </div>
          <div className="w-48">
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
          </div>
          <div className="w-56">
            <Select
              label="Hotel"
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
          </div>
          <Button type="submit" loading={inviting}>
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
        </form>
      </div>

      {/* Staff list */}
      <div className="rounded-xl border border-navy-100 bg-white">
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-navy-500">Staff Members</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-navy-300">
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      {member.name && (
                        <p className="font-medium text-navy-500">{member.name}</p>
                      )}
                      {member.email && (
                        <p className="text-xs text-navy-300">{member.email}</p>
                      )}
                      {!member.name && !member.email && (
                        <p className="text-navy-300">-</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE_VARIANT[member.role]}>
                      {member.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.hotel?.name ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "green" : "red"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeactivate(member.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <ShieldOff className="h-4 w-4" />
                        Deactivate
                      </Button>
                    )}
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
