export interface OverviewSummary {
  activeUsersToday: number;
  activeUsersThisWeek: number;
  churnedUsers: number;
  totalUsers: number;
  totalProviders: number;
  totalReferrals: number;
  totalCampaigns: number;
  totalAmbassadors: number;
  totalAdminUsers: number;
}

export type TopAmbassadorPeriod = "7d" | "30d" | "90d" | "all";

export interface TopAmbassador {
  id: string;
  rank?: number;
  fullName?: string;
  name?: string;
  email?: string;
  code?: string;
  phoneNumber?: string;
  photoUrl?: string | null;
  avatarUrl?: string | null;
  avatar?: string | null;
  usersIntroduced?: number;
  totalUsersIntroduced?: number;
  referralsCount?: number;
  activeCampaign?: {
    id: string;
    name: string;
    type?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface CampaignTypeStat {
  users: number;
  share: number;
}

export interface CampaignTypesSummary {
  totalUsersAccumulated: number;
  physical: CampaignTypeStat;
  digital: CampaignTypeStat;
}

export interface MonthAcquisition {
  month: string;
  users: number;
}

export interface UserAcquisitionData {
  year: number;
  total: number;
  months: MonthAcquisition[];
}

export interface ActiveUserLocation {
  location: string;
  users: number;
  share: number;
}

export interface ActiveUserPoint {
  latitude: number;
  longitude: number;
  users: number;
}

export interface ActiveUsersData {
  activeUsers: number;
  topLocations: ActiveUserLocation[];
  points: ActiveUserPoint[];
}

export interface AgeDistributionBand {
  label: string;
  users: number;
  share: number;
}

export interface AgeDistributionData {
  knownAges: number;
  unknownAges: number;
  under18: number;
  bands: AgeDistributionBand[];
}

