export type ReferralStatus =
  | "NEW"
  | "ACTIVE"
  | "REDEEMED"
  | "CONVERTED"
  | "EXPIRED"
  | "CANCELLED"
  | "REJECTED";

export type ReferralSource =
  | "WHATSAPP"
  | "CAMPAIGN"
  | "AMBASSADOR"
  | "ADMIN";

export interface ReferralsSummary {
  totalReferrals?: number;
  activeReferrals?: number;
  redeemedReferrals?: number;
  convertedReferrals?: number;
  expiredReferrals?: number;
  redemptionRate?: number;
  conversionRate?: number;
  [key: string]: unknown;
}

export interface ReferralUserSummary {
  id: string;
  name?: string | null;
  fullName?: string | null;
  reference?: string | null;
  location?: string | null;
  rating?: string | number | null;
  joinedDate?: string | null;
  createdAt?: string | null;
  lastActiveDate?: string | null;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  [key: string]: unknown;
}

export interface ReferralProviderSummary {
  id: string;
  name?: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  initials?: string | null;
  onboardingDate?: string | null;
  createdAt?: string | null;
  avatarUrl?: string | null;
  [key: string]: unknown;
}

export interface ReferralAmbassadorSummary {
  id: string;
  name?: string | null;
  fullName?: string | null;
  code?: string | null;
  [key: string]: unknown;
}

export interface ReferralCampaignSummary {
  id: string;
  name?: string | null;
  [key: string]: unknown;
}

export interface ReferralTimelineEvent {
  id: string;
  title: string;
  timestamp: string;
}

export interface ReferralItem {
  id: string;
  code: string;
  status: ReferralStatus | string;
  source?: ReferralSource | string | null;
  user?: ReferralUserSummary | null;
  provider?: ReferralProviderSummary | null;
  ambassador?: ReferralAmbassadorSummary | null;
  campaign?: ReferralCampaignSummary | null;
  category?: { id: string; name?: string } | null;
  dateGenerated?: string | null;
  generationDate?: string | null;
  createdAt?: string | null;
  redeemedAt?: string | null;
  redemptionDate?: string | null;
  convertedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  expiredAt?: string | null;
  history?: ReferralTimelineEvent[] | null;
  [key: string]: unknown;
}

export interface ReferralsListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReferralStatus | string;
  from?: string;
  to?: string;
  campaignId?: string;
  providerId?: string;
  userId?: string;
  ambassadorId?: string;
  source?: ReferralSource | string;
  code?: string;
}

export interface ReferralsListResponse {
  items?: ReferralItem[];
  data?: ReferralItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  [key: string]: unknown;
}

export interface AdminCreateReferralDto {
  userId: string;
  providerId: string;
  categoryId?: string;
}

export interface RedeemReferralDto {
  code: string;
}

export interface CancelReferralDto {
  reason?: string;
}
