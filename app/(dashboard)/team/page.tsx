"use client";

import React, { useState, Suspense } from "react";
import TeamMetricsCard from "@/components/team/team-metrics-card";
import TeamTable from "@/components/team/team-table";
import AddTeamMemberModal from "@/components/team/add-team-member-modal";
import InviteSuccessModal from "@/components/team/invite-success-modal";
import DisableMemberModal from "@/components/team/disable-member-modal";
import DeleteMemberModal from "@/components/team/delete-member-modal";
import EditTeamMemberModal, { TeamMember } from "@/components/team/edit-team-member-modal";

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "peter@gmail.com",
    role: "Super Admin",
    dateJoined: "Sept, 10, 2023",
    lastActive: "Sept, 10, 2023",
    status: "Active",
    avatarInitials: "JD",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "james@gmail.com",
    role: "Admin",
    dateJoined: "Sept, 10, 2023",
    lastActive: "Sept, 10, 2023",
    status: "Active",
    avatarInitials: "JD",
  },
  {
    id: "3",
    name: "Robin Hood",
    email: "jamal@gmail.com",
    role: "Admin",
    dateJoined: "Sept, 10, 2023",
    lastActive: "Sept, 10, 2023",
    status: "Inactive",
    avatarInitials: "JD",
  },
  {
    id: "4",
    name: "Anna Ruth",
    email: "mark@gmail.com",
    role: "Support",
    dateJoined: "Sept, 10, 2023",
    lastActive: "Sept, 10, 2023",
    status: "Disabled",
    avatarInitials: "JD",
  },
];

function TeamPageContent() {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastInvitedMemberName, setLastInvitedMemberName] = useState("");

  const [memberToDisable, setMemberToDisable] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);

  // Compute metrics
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const disabledMembers = members.filter((m) => m.status === "Disabled").length;

  const handleAddMember = (newMemberData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => {
    const fullName = `${newMemberData.firstName} ${newMemberData.lastName}`.trim();
    const initials =
      `${newMemberData.firstName[0] || ""}${newMemberData.lastName[0] || ""}`.toUpperCase() ||
      "JD";

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: fullName,
      email: newMemberData.email,
      role: newMemberData.role as "Super Admin" | "Admin" | "Support",
      dateJoined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      lastActive: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      status: "Active",
      avatarInitials: initials,
    };

    setMembers((prev) => [newMember, ...prev]);
    setIsAddModalOpen(false);
    setLastInvitedMemberName(fullName);
    setIsSuccessModalOpen(true);
  };

  const handleConfirmDisable = () => {
    if (!memberToDisable) return;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberToDisable.id) {
          return {
            ...m,
            status: m.status === "Disabled" ? "Active" : "Disabled",
          };
        }
        return m;
      })
    );
    setMemberToDisable(null);
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
    setMemberToDelete(null);
  };

  const handleSaveEdit = (updatedMember: TeamMember) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
            Team
          </h1>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Add New Team Member
          </button>
        </div>
      </div>

      {/* Metrics Card */}
      <TeamMetricsCard
        totalMembers={totalMembers}
        activeMembers={activeMembers}
        disabledMembers={disabledMembers}
      />

      {/* Team Table */}
      <TeamTable
        members={members}
        onEdit={(m) => setMemberToEdit(m)}
        onDisableToggle={(m) => setMemberToDisable(m)}
        onDelete={(m) => setMemberToDelete(m)}
      />

      {/* Add Team Member Modal (Image 2) */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
      />

      {/* Successfully Invited Modal (Image 3) */}
      <InviteSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="You have successfully invited an admin user"
      />

      {/* Disable Member Confirmation Modal (Image 4) */}
      <DisableMemberModal
        isOpen={!!memberToDisable}
        memberName={memberToDisable?.name}
        isCurrentlyDisabled={memberToDisable?.status === "Disabled"}
        onClose={() => setMemberToDisable(null)}
        onConfirm={handleConfirmDisable}
      />

      {/* Delete Member Confirmation Modal */}
      <DeleteMemberModal
        isOpen={!!memberToDelete}
        memberName={memberToDelete?.name}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Member Modal */}
      <EditTeamMemberModal
        isOpen={!!memberToEdit}
        member={memberToEdit}
        onClose={() => setMemberToEdit(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#667085] text-sm">Loading team...</div>}>
      <TeamPageContent />
    </Suspense>
  );
}
