export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  avatarUrl?: string | null;
  status?: string;
  role?: {
    id?: string;
    name?: string;
    label?: string;
  } | string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface SystemSettingItem {
  key: string;
  value: unknown;
  default: unknown;
  description: string;
  updatedAt?: string | null;
  updatedById?: string | null;
  [key: string]: unknown;
}

export interface UpdateSettingDto {
  value: unknown;
}

export interface ServiceCategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    providers?: number;
  };
  [key: string]: unknown;
}

export interface CreateServiceCategoryDto {
  slug: string;
  name: string;
  description?: string;
}

export interface UpdateServiceCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
