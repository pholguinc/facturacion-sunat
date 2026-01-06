export interface Permission {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export interface Module {
    id: string;
    name: string;
    isActive: boolean;
    permissions: Permission[];
}

export interface PermissionsApiResponse {
    statusCode: number;
    message: string;
    data: {
        modules: Module[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface PermissionCreateResponse {
    statusCode: number;
    message: string;
    data: {
        message: string;
    };
}
