import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionsApiResponse } from '../interfaces/permissions.interface';
import { PaginationParams } from '@/app/shared/datatable/datatable.component';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private apiUrl = `${environment.apiUrl}/permissions`;

    constructor(private http: HttpClient) { }

    getPermissions(params: PaginationParams): Observable<PermissionsApiResponse> {
        let httpParams = new HttpParams()
            .set('page', params.page.toString())
            .set('limit', params.limit.toString());

        if (params.search) {
            httpParams = httpParams.set('search', params.search);
        }

        return this.http.get<PermissionsApiResponse>(this.apiUrl + '/list', { params: httpParams });
    }
}
