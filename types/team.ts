export type TeamRole = "SUPER_ADMIN" | "ADMIN" | "SUPPORT";
export type TeamStatus = "ACTIVE" | "INACTIVE" | "DISABLED";

export interface TeamMemberItem {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email: string;
  role: TeamRole | string | Record<string, unknown>;
  status: TeamStatus | string | Record<string, unknown>;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  joinedAt?: string | null;
  createdAt?: string | null;
  dateJoined?: string | null;
  lastActiveAt?: string | null;
  lastActive?: string | null;
  lastLoginAt?: string | null;
  [key: string]: unknown;
}

export interface TeamSummary {
  totalMembers?: number;
  total?: number;
  activeMembers?: number;
  active?: number;
  inactiveMembers?: number;
  inactive?: number;
  disabledMembers?: number;
  disabled?: number;
  [key: string]: unknown;
}

export interface TeamListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: TeamRole;
  status?: TeamStatus;
}

export interface TeamListResponse {
  items?: TeamMemberItem[];
  data?: TeamMemberItem[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
  [key: string]: unknown;
}

export interface InviteTeamMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole | string;
}

export interface UpdateTeamMemberDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: TeamRole | string;
}

export interface TeamRoleItem {
  id?: string;
  key?: string;
  name?: string;
  label?: string;
  description?: string;
  permissions?: string[];
  [key: string]: unknown;
}
