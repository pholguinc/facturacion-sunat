import { Permission } from './permissions.interface';

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface RoleUpdateRequest {
  name: string;
  description: string;
  branchId: string;
  permissions: string[];
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  branchId: string;
}

export interface RolesApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: Role[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
export interface RoleDetail {
  id: string;
  branchId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  permissions: Permission[];
}

export interface RoleDetailResponse {
  statusCode: number;
  message: string;
  data: RoleDetail;
}
