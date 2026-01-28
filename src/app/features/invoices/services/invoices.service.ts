import { PaginationParams } from '@/app/shared/datatable/datatable.component';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IInvoicesApiResponse } from '../interfaces/invoice-document.interface';
import { Observable } from 'rxjs';
import { ICreateInvoiceRequest } from '../interfaces/create-invoice.interface';
import { IInvoicesPDFDownload } from '../interfaces/invoices-download.interface';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private apiUrl = `${environment.apiUrl}/sunat-invoices`;

  constructor(private http: HttpClient) {}

  getInvoices(params: PaginationParams): Observable<IInvoicesApiResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString())
      .set('receiptTypeId', params.receiptTypeId!);

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if ((params as any).receiptTypeId) {
      httpParams = httpParams.set(
        'receiptTypeId',
        (params as any).receiptTypeId,
      );
    }

    return this.http.get<IInvoicesApiResponse>(this.apiUrl + '/list', {
      params: httpParams,
    });
  }

  createInvoice(data: ICreateInvoiceRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  generatePdf(request: IInvoicesPDFDownload): Observable<Blob> {
    return this.http.post(this.apiUrl + '/download-pdf', request, {
      responseType: 'blob',
    });
  }

  generateXml(invoiceId: string): Observable<Blob> {
    return this.http.post(
      this.apiUrl + '/download-xml',
      { invoiceId },
      {
        responseType: 'blob',
      },
    );
  }

  generateCdr(invoiceId: string): Observable<Blob> {
    return this.http.post(
      this.apiUrl + '/download-cdr',
      { invoiceId },
      {
        responseType: 'blob',
      },
    );
  }
}
