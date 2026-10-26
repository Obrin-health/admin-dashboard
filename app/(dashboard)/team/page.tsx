"use client";

import React, { useState, Suspense } from "react";
import TeamMetricsCard from "@/components/team/team-metrics-card";
import TeamTable from "@/components/team/team-table";
import AddTeamMemberModal from "@/components/team/add-team-member-modal";
import InviteSuccessModal from "@/components/team/invite-success-modal";
import DisableMemberModal from "@/components/team/disable-member-modal";
import DeleteMemberModal from "@/components/team/delete-member-modal";
import EditTeamMemberModal, {
  TeamMember,
  EditTeamMemberPayload,
} from "@/components/team/edit-team-member-modal";
import {
  useTeamSummary,
  useInviteTeamMember,
  useUpdateTeamMember,
  useDisableTeamMember,
  useEnableTeamMember,
  useDeleteTeamMember,
  useResendInviteTeamMember,
} from "@/hooks/use-team";
import { useCurrentUser } from "@/hooks/use-auth";
import type { TeamRole } from "@/types/team";

function TeamPageContent() {
  // Current logged in user
  const { data: currentUser } = useCurrentUser();

  // Summary metrics query
  const { data: summary, isLoading: isSummaryLoading } = useTeamSummary();

  // Mutations
  const inviteMutation = useInviteTeamMember();
  const updateMutation = useUpdateTeamMember();
  const disableMutation = useDisableTeamMember();
  const enableMutation = useEnableTeamMember();
  const deleteMutation = useDeleteTeamMember();
  const resendInviteMutation = useResendInviteTeamMember();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastInvitedMemberName, setLastInvitedMemberName] = useState("");

  const [memberToDisable, setMemberToDisable] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);

  // Extract metrics safely
  const totalMembers = summary?.totalMembers ?? summary?.total;
  const activeMembers = summary?.activeMembers ?? summary?.active;
  const disabledMembers = summary?.disabledMembers ?? summary?.disabled;

  const handleAddMember = async (newMemberData: {
    firstName: string;
    lastName: string;
    email: string;
    role: TeamRole;
  }) => {
    try {
      await inviteMutation.mutateAsync({
        firstName: newMemberData.firstName,
        lastName: newMemberData.lastName,
        email: newMemberData.email,
        role: newMemberData.role,
      });
      setIsAddModalOpen(false);
      setLastInvitedMemberName(
        `${newMemberData.firstName} ${newMemberData.lastName}`.trim()
      );
      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      console.error("Failed to invite team member", err);
    }
  };

  const handleSaveEdit = async (payload: EditTeamMemberPayload) => {
    try {
      await updateMutation.mutateAsync({
        id: payload.id,
        payload: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          role: payload.role,
        },
      });
      setMemberToEdit(null);
    } catch (err: unknown) {
      console.error("Failed to update team member", err);
    }
  };

  const isSelf = (m?: TeamMember | null) => {
    if (!m || !currentUser) return false;
    return (
      (currentUser.id && String(currentUser.id) === String(m.id)) ||
      (currentUser.email &&
        m.email &&
        currentUser.email.toLowerCase() === m.email.toLowerCase())
    );
  };

  const handleConfirmDisable = async () => {
    if (!memberToDisable || isSelf(memberToDisable)) {
      setMemberToDisable(null);
      return;
    }
    try {
      if (memberToDisable.status === "Disabled") {
        await enableMutation.mutateAsync(memberToDisable.id);
      } else {
        await disableMutation.mutateAsync(memberToDisable.id);
      }
      setMemberToDisable(null);
    } catch (err: unknown) {
      console.error("Failed to update member status", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete || isSelf(memberToDelete)) {
      setMemberToDelete(null);
      return;
    }
    try {
      await deleteMutation.mutateAsync(memberToDelete.id);
      setMemberToDelete(null);
    } catch (err: unknown) {
      console.error("Failed to delete team member", err);
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    if (isSelf(member)) return;
    try {
      await resendInviteMutation.mutateAsync(member.id);
    } catch (err: unknown) {
      console.error("Failed to resend invite", err);
    }
  };

  return (
    <div className="w-full max-w-350 mx-auto pb-12 font-sans select-none">
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
        isLoading={isSummaryLoading}
      />

      {/* Team Table */}
      <TeamTable
        onEdit={(m) => setMemberToEdit(m)}
        onDisableToggle={(m) => setMemberToDisable(m)}
        onDelete={(m) => setMemberToDelete(m)}
        onResendInvite={handleResendInvite}
      />

      {/* Add Team Member Modal */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        isSubmitting={inviteMutation.isPending}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
      />

      {/* Successfully Invited Modal */}
      <InviteSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={
          lastInvitedMemberName
            ? `You have successfully invited ${lastInvitedMemberName} to the team.`
            : "You have successfully invited an admin user."
        }
      />

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        isOpen={!!memberToEdit}
        member={memberToEdit}
        isSubmitting={updateMutation.isPending}
        onClose={() => setMemberToEdit(null)}
        onSave={handleSaveEdit}
      />

      {/* Disable Member Confirmation Modal */}
      <DisableMemberModal
        isOpen={!!memberToDisable}
        memberName={memberToDisable?.name}
        isCurrentlyDisabled={memberToDisable?.status === "Disabled"}
        isSubmitting={
          disableMutation.isPending || enableMutation.isPending
        }
        onClose={() => setMemberToDisable(null)}
        onConfirm={handleConfirmDisable}
      />

      {/* Delete Member Confirmation Modal */}
      <DeleteMemberModal
        isOpen={!!memberToDelete}
        memberName={memberToDelete?.name}
        isSubmitting={deleteMutation.isPending}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BB1A8C]" />
        </div>
      }
    >
      <TeamPageContent />
    </Suspense>
  );
}
