export interface IInvoiceDocument {
  id: string;
  invoiceId: string;
  documentNumber: string;
  companyRuc: string;
  customerName: string;
  total: number;
  documentSeriesId: string;
  receiptTypeId: string;
  receiptTypeName: string;
  status: string;
  respuestaSunat: string;
  xml: string;
  cdr: string;
  pdf?: string;
}

export interface IInvoicesApiResponse {
  statusCode: number;
  message: string;
  data: {
    message?: string;
    items: IInvoiceDocument[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
