import { Injectable } from '@angular/core';
import {
  PaginationParams,
  SerieCreateRequest,
  SeriesApiResponse,
} from '../interfaces/series.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private apiUrl = `${environment.apiUrl}/series`;

  constructor(private http: HttpClient) {}

  getSeries(params: PaginationParams): Observable<SeriesApiResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString())
      .set('branchId', params.branchId?.toString() || '')
      .set('receiptTypeId', params.receiptTypeId?.toString() || '')
      .set('company', params.company?.toString() || '')
      .set('isActive', params.isActive?.toString() || '');

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.sortBy) {
      httpParams = httpParams
        .set('sortBy', params.sortBy)
        .set('sortOrder', (params.sortOrder || 'asc').toUpperCase());
    }

    return this.http.get<SeriesApiResponse>(this.apiUrl + '/list', {
      params: httpParams,
    });
  }

  createSerie(request: SerieCreateRequest): Observable<SeriesApiResponse> {
    return this.http.post<SeriesApiResponse>(this.apiUrl, request);
  }

  deleteSerie(id: string): Observable<SeriesApiResponse> {
    return this.http.delete<SeriesApiResponse>(`${this.apiUrl}/${id}`);
  }
}
