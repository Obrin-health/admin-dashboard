export interface UsersSummary {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersWithReferrals: number;
  redeemedReferrals: number;
  convertedUsers: number;
}

export type UserSource = "WHATSAPP" | "AMBASSADOR" | "CAMPAIGN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type UserVerification = "VERIFIED" | "NOT_VERIFIED";

export interface AdminUserItem {
  id: string;
  reference: string;
  name: string | null;
  whatsappId: string;
  source: UserSource | string;
  campaign: {
    id: string;
    name: string;
  } | null;
  ambassador: {
    id: string;
    fullName: string;
  } | null;
  verification: UserVerification | string;
  referralsGenerated: number;
  referralsRedeemed: number;
  messagesSent: number;
  conversations: number;
  joinedAt: string;
  lastActiveAt: string | null;
  status: UserStatus | string;
}

export interface UsersListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: UserStatus;
  source?: UserSource;
  campaignId?: string;
  from?: string;
  to?: string;
}

export interface UsersListResponse {
  data: AdminUserItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UserLocation {
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface UserStats {
  clinicSearches: number;
  generatedCodes: number;
  redeemedCodes: number;
  convertedCodes: number;
  conversionRate: number;
  lastActiveAt: string | null;
}

export interface UserDetail {
  id: string;
  reference: string;
  name: string | null;
  whatsappId: string;
  source: UserSource | string;
  campaign: {
    id: string;
    name: string;
  } | null;
  ambassador: {
    id: string;
    fullName: string;
  } | null;
  verification: UserVerification | string;
  referralsGenerated: number;
  referralsRedeemed: number;
  messagesSent: number;
  conversations: number;
  joinedAt: string;
  lastActiveAt: string | null;
  status: UserStatus | string;
  age: number | null;
  location: UserLocation | null;
  firstInteractionAt: string | null;
  stats: UserStats | null;
}

export interface UserReferralProvider {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface UserReferralItem {
  id: string;
  code: string;
  provider: UserReferralProvider;
  location: string;
  generatedAt: string;
  redeemedAt: string | null;
  status: string;
}

export interface UserReferralsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  from?: string;
  to?: string;
}

export interface UserReferralsResponse {
  data: UserReferralItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

