export type ProviderType =
  | "CLINIC"
  | "HOSPITAL"
  | "PHARMACY"
  | "LABORATORY"
  | "DELIVERY_PARTNER"
  | "OTHER";

export type ProviderStatus = "ACTIVE" | "SUSPENDED";

export interface ProvidersSummary {
  totalProviders: number;
  activeProviders: number;
  suspendedProviders: number;
  totalReferralsReceived: number;
  totalRedeemedReferrals: number;
  overallConversionRate: number;
}

export interface ProviderService {
  id: string;
  slug: string;
  name: string;
}

export interface ProviderQuickStats {
  asOf: string;
  totalReferrals: number;
  redeemed: number;
  converted: number;
  conversionRate: number;
}

export interface ProviderUser {
  id: string;
  fullName: string;
  email: string;
  role: "OWNER" | "STAFF" | string;
  status?: string;
}

export interface ProviderDetail {
  id: string;
  reference: string;
  name: string;
  type: ProviderType | string;
  status: ProviderStatus | string;
  description: string | null;
  logoUrl: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  website: string | null;
  addressLine: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  operatingHours: Record<string, unknown> | null;
  availability: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  location: string;
  onboardedAt: string;
  services: ProviderService[];
  quickStats: ProviderQuickStats;
  users: ProviderUser[];
}

export interface ProvidersListParams {
  page?: number;
  pageSize?: number;
  status?: ProviderStatus;
  type?: ProviderType;
  state?: string;
  city?: string;
  categoryId?: string;
  search?: string;
}

export interface ProvidersListResponse {
  data: ProviderDetail[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ProviderReferralItem {
  id: string;
  code: string;
  user: {
    id: string;
    name: string | null;
    reference: string;
  } | null;
  location: string;
  ambassador: {
    id: string;
    fullName: string;
  } | null;
  campaign: {
    id: string;
    name: string;
  } | null;
  dateGenerated: string;
  redeemedAt: string | null;
  status: "ACTIVE" | "REDEEMED" | "CONVERTED" | "EXPIRED" | "CANCELLED" | "REJECTED" | string;
}

export interface ProviderReferralsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  from?: string;
  to?: string;
}

export interface ProviderReferralsResponse {
  data: ProviderReferralItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
