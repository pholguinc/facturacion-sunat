export interface ICompany {
  id: string;
  razonSocial: string;
  branchName: string;
  numeroDocumento: string;
  domicilioFiscal: string;
  ubigeo: string;
  isActive: boolean;
}

export interface ICompaniesApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: ICompany[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ICompaniesBranchApiResponse {
  statusCode: number;
  message: string;
  data: ICompany;
}
