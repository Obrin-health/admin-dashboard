export type AmbassadorStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface AmbassadorsSummary {
  totalAmbassadors: number;
  activeAmbassadors: number;
  usersIntroduced: number;
  referralsGenerated: number;
  redeemedReferrals: number;
  convertedUsers: number;
  [key: string]: unknown;
}

export interface AmbassadorCampaign {
  id: string;
  name: string;
  type?: "PHYSICAL" | "DIGITAL" | string;
  status?: string;
  [key: string]: unknown;
}

export interface AmbassadorListItem {
  id: string;
  fullName: string;
  name?: string;
  code?: string;
  phoneNumber: string;
  contactNumber?: string;
  email?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  avatarUrl?: string | null;
  status: AmbassadorStatus | "Active" | "Suspended" | "Inactive";
  type?: "PHYSICAL" | "DIGITAL" | "Physical" | "Digital" | string;
  activeCampaign?: AmbassadorCampaign | string | null;
  totalUsersIntroduced: number;
  referralsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AmbassadorsListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: AmbassadorStatus;
  campaignId?: string;
  from?: string;
  to?: string;
}

export interface AmbassadorsListResponse {
  items?: AmbassadorListItem[];
  data?: AmbassadorListItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

export interface CreateAmbassadorDto {
  fullName: string;
  phoneNumber: string;
  email?: string;
  location?: string;
  photoUrl?: string;
}

export interface UpdateAmbassadorDto {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  photoUrl?: string;
}

export interface AmbassadorDetail {
  id: string;
  fullName: string;
  name?: string;
  code?: string;
  phoneNumber: string;
  email?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  status: AmbassadorStatus | "Active" | "Suspended" | "Inactive";
  activeCampaign?: AmbassadorCampaign | string | null;
  totalUsersIntroduced?: number;
  referralsCount?: number;
  redeemedCount?: number;
  conversionRate?: number;
  referralLink?: string;
  createdAt?: string;
  lastReferralDate?: string | null;
  firstReferralDate?: string | null;
  [key: string]: unknown;
}

export interface AmbassadorUsersParams {
  page?: number;
  pageSize?: number;
  campaignId?: string;
  from?: string;
  to?: string;
}

export interface AmbassadorUserItem {
  id?: string;
  fullName?: string;
  name?: string;
  user?:
    | {
        id?: string;
        name?: string;
        fullName?: string;
        reference?: string;
        [key: string]: unknown;
      }
    | string;
  phoneNumber?: string;
  email?: string | null;
  campaign?:
    | {
        id?: string;
        name?: string;
        title?: string;
        reference?: string;
        [key: string]: unknown;
      }
    | string
    | null;
  type?: "PHYSICAL" | "DIGITAL" | "Physical" | "Digital" | string;
  joinedAt?: string;
  referralDate?: string;
  referralCode?: string;
  reference?: string;
  action?: "Registered" | "Redeemed" | "Pending" | string;
  role?: "User" | "Provider" | "Ambassador" | string;
  [key: string]: unknown;
}

export interface AmbassadorUsersResponse {
  items?: AmbassadorUserItem[];
  data?: AmbassadorUserItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface AmbassadorCampaignsParams {
  page?: number;
  pageSize?: number;
  status?:
    | "SCHEDULED"
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETED"
    | "CANCELLED"
    | "ARCHIVED"
    | string;
  type?: "PHYSICAL" | "DIGITAL" | string;
}

export interface AmbassadorCampaignItem {
  id: string;
  name: string;
  campaign?: string;
  type: "PHYSICAL" | "DIGITAL" | "Physical" | "Digital" | string;
  status:
    | "SCHEDULED"
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETED"
    | "CANCELLED"
    | "ARCHIVED"
    | "Active"
    | "Inactive"
    | "Suspended"
    | string;
  startDate?: string;
  endDate?: string;
  period?: string;
  usersAccumulated?: number;
  [key: string]: unknown;
}

export interface AmbassadorCampaignsResponse {
  items?: AmbassadorCampaignItem[];
  data?: AmbassadorCampaignItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface AmbassadorCampaignPerformanceItem {
  id?: string;
  name: string;
  value: number;
  display?: string;
  color?: string;
  pct?: number;
  [key: string]: unknown;
}

export interface AmbassadorUserAcquisitionMonth {
  month: string;
  users?: number;
  heightPct?: number;
  val?: string;
  [key: string]: unknown;
}

export interface AmbassadorUserAcquisitionData {
  year: number;
  total: number;
  months: AmbassadorUserAcquisitionMonth[];
  [key: string]: unknown;
}
