import { PaginationParams } from '@/app/shared/datatable/datatable.component';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICompaniesApiResponse,
  ICompaniesBranchApiResponse,
  ICompany,
} from '../interfaces/companies.interface';
import {
  IApiCertificateResponse,
  ICertificateValidityResponse,
} from '../interfaces/certificate.interface';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  getCompanies(params: PaginationParams): Observable<ICompaniesApiResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<ICompaniesApiResponse>(this.apiUrl + '/list', {
      params: httpParams,
    });
  }

  certificateValidity(
    pemContent: string,
  ): Observable<ICertificateValidityResponse> {
    return this.http.post<ICertificateValidityResponse>(
      this.apiUrl + '/certificate-validity',
      { pemContent },
    );
  }

  convertPFXtoPem(
    file: File,
    password: string,
  ): Observable<IApiCertificateResponse> {
    const formData = new FormData();
    formData.append('certificado', file);
    formData.append('password', password);

    return this.http.post<IApiCertificateResponse>(
      `${this.apiUrl}/convert-pfx-pem`,
      formData,
    );
  }

  getCompanyByBranchId(id: string): Observable<ICompaniesBranchApiResponse> {
    return this.http.get<ICompaniesBranchApiResponse>(
      `${this.apiUrl}/branch/${id}`,
    );
  }
}
