export interface IReceiptType {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface IReceiptTypesApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: IReceiptType[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface IReceiptTypesBranchApiResponse {
  statusCode: number;
  message: string;
  data: IReceiptType[];
}
