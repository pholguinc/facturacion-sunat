export interface Serie {
  id: string;
  serie: string;
  correlatives: number;
  isActive: boolean;
  company: {
    id: string;
    nombreComercial: string;
    razonSocial: string;
    ruc: string;
    branch: {
      id: string;
      name: string;
    };
    receiptType: {
      id: string;
      name: string;
    };
  };
}

export interface SeriesApiResponse {
  statusCode: number;
  message: string;
  data: {
    message?: string;
    items: Serie[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  branchId?: string;
  receiptTypeId?: string;
  company?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SerieCreateRequest {
  branchId: string;
  receiptTypeId: string;
  serie: string;
  correlative: number;
}
