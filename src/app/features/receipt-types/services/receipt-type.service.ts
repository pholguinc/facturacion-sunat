import { PaginationParams } from '@/app/shared/datatable/datatable.component';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IReceiptTypesApiResponse,
  IReceiptTypesBranchApiResponse,
} from '../interfaces/receipt-types.interface';

@Injectable({
  providedIn: 'root',
})
export class ReceiptTypesService {
  private apiUrl = `${environment.apiUrl}/receipt-types`;

  constructor(private http: HttpClient) {}

  getReceiptTypes(
    params: PaginationParams,
  ): Observable<IReceiptTypesApiResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<IReceiptTypesApiResponse>(this.apiUrl + '/list', {
      params: httpParams,
    });
  }

  getReceiptTypeByBranchId(
    id: string,
  ): Observable<IReceiptTypesBranchApiResponse> {
    return this.http.get<IReceiptTypesBranchApiResponse>(
      this.apiUrl + '/branch/' + id,
    );
  }
}
