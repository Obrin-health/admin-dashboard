export type CampaignStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "SCHEDULED"
  | "ARCHIVED";

export type CampaignType = "PHYSICAL" | "DIGITAL";

export interface CampaignSummary {
  totalCampaigns?: number;
  completedCampaigns?: number;
  activeCampaigns?: number;
  totalUsersAcquired?: number;
  convertedUsers?: number;
  conversionRate?: number;
  [key: string]: unknown;
}

export interface CampaignAmbassadorSummary {
  id: string;
  fullName?: string;
  name?: string;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  code?: string;
  [key: string]: unknown;
}

export interface CampaignItem {
  id: string;
  name: string;
  type: CampaignType | string;
  status: CampaignStatus | string;
  description?: string | null;
  imageUrl?: string | null;
  startDate?: string;
  endDate?: string;
  totalReferrals?: number;
  usersAcquired?: number;
  convertedUsers?: number;
  conversionRate?: number;
  ambassadorsCount?: number;
  ambassadors?: CampaignAmbassadorSummary[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CampaignsListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CampaignStatus | string;
  type?: CampaignType | string;
}

export interface CampaignsListResponse {
  items?: CampaignItem[];
  data?: CampaignItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface CreateCampaignDto {
  name: string;
  type: "PHYSICAL" | "DIGITAL";
  startDate: string;
  endDate: string;
  ambassadorIds: string[];
  description?: string;
  imageUrl?: string;
}

export interface UpdateCampaignDto {
  name?: string;
  type?: "PHYSICAL" | "DIGITAL";
  startDate?: string;
  endDate?: string;
  description?: string;
  imageUrl?: string;
}

export interface AddAmbassadorsDto {
  ambassadorIds: string[];
}

export interface CampaignAmbassadorItem {
  id: string;
  ambassadorId?: string;
  name?: string;
  fullName?: string;
  ambassadorName?: string;
  totalUsersIntroduced?: number;
  usersIntroduced?: number;
  referralLink?: string;
  code?: string;
  dateAdded?: string;
  createdAt?: string;
  addedBy?: string;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  [key: string]: unknown;
}

export interface CampaignAmbassadorsResponse {
  items?: CampaignAmbassadorItem[];
  data?: CampaignAmbassadorItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface CampaignUserItem {
  id: string;
  campaign?: string | { name?: string; id?: string };
  campaignName?: string;
  userIntroduced?: string;
  fullName?: string;
  name?: string;
  user?: {
    id?: string;
    name?: string;
    fullName?: string;
    reference?: string;
    [key: string]: unknown;
  };
  ambassador?: string | { name?: string; fullName?: string; id?: string };
  ambassadorName?: string;
  referralCode?: string;
  dateJoined?: string;
  referralDate?: string;
  createdAt?: string;
  action?: string;
  role?: string;
  [key: string]: unknown;
}

export interface CampaignUsersParams {
  page?: number;
  pageSize?: number;
  ambassadorId?: string;
  from?: string;
  to?: string;
}

export interface CampaignUsersResponse {
  items?: CampaignUserItem[];
  data?: CampaignUserItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface CampaignUserAcquisitionMonth {
  month: string;
  users?: number;
  val?: string;
  heightPct?: number;
  [key: string]: unknown;
}

export interface CampaignUserAcquisitionData {
  year: number;
  total?: number;
  months: CampaignUserAcquisitionMonth[];
  [key: string]: unknown;
}

export interface CampaignTopAmbassadorItem {
  id?: string;
  name?: string;
  fullName?: string;
  ambassadorName?: string;
  users?: number;
  totalUsersIntroduced?: number;
  display?: string;
  color?: string;
  pct?: number;
  [key: string]: unknown;
}
