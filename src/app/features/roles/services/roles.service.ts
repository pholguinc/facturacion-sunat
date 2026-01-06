import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RolesApiResponse,
  RoleDetailResponse,
  RoleUpdateRequest,
  RoleCreateRequest,
} from '../interfaces/roles.interface';
import { PaginationParams } from '../../../shared/datatable/datatable.component';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getRoleById(id: string): Observable<RoleDetailResponse> {
    return this.http.get<RoleDetailResponse>(`${this.apiUrl}/${id}`);
  }

  getRoles(params: PaginationParams): Observable<RolesApiResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.sortBy) {
      httpParams = httpParams
        .set('sortBy', params.sortBy)
        .set('sortOrder', (params.sortOrder || 'asc').toUpperCase());
    }

    return this.http.get<RolesApiResponse>(this.apiUrl + '/list', {
      params: httpParams,
    });
  }

  createRole(request: RoleCreateRequest): Observable<RoleDetailResponse> {
    return this.http.post<RoleDetailResponse>(this.apiUrl, request);
  }

  updateRole(
    id: string,
    request: RoleUpdateRequest
  ): Observable<RoleDetailResponse> {
    return this.http.put<RoleDetailResponse>(`${this.apiUrl}/${id}`, request);
  }
}
