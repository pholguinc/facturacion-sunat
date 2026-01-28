export interface IApiCertificateResponse {
  data: {
    pem: string;
  };
}

export interface ICertificateValidityResponse {
  data: {
    isValid: boolean;
    issueDate: string; // ISO 8601 date string
    expirationDate: string; // ISO 8601 date string
    daysRemaining: number;
    issuer: string;
    subject: string;
    serialNumber: string;
  };
}
