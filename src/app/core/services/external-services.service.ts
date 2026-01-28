import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiSunatResponse } from '../interfaces/data-sunat.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExternalServicesService {
  private apiUrl = `${environment.apiUrl}/external-services`;

  constructor(private http: HttpClient) {}

  getDataSunat(ruc: string): Observable<IApiSunatResponse> {
    return this.http.get<IApiSunatResponse>(`${this.apiUrl}/sunat`, {
      params: { ruc },
    });
  }
}
