import { Component, OnInit } from '@angular/core';
import {
  DatatableComponent,
  PaginationParams,
  TableAction,
  TableColumn,
} from '@/shared/datatable/datatable.component';
import { NgxToastModule } from '@angular-magic/ngx-toast';
import { firstValueFrom } from 'rxjs';
import { IInvoiceDocument } from './interfaces/invoice-document.interface';
import { InvoicesService } from './services/invoices.service';
import { MatDialog } from '@angular/material/dialog';
import { GeneratePdfComponent } from './components/generate-pdf/generate-pdf.component';
import { SunatDetailsComponent } from './components/sunat-details/sunat-details.component';
import { NgxToastService } from '@angular-magic/ngx-toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  imports: [DatatableComponent, NgxToastModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent implements OnInit {
  receiptTypeId: string | null = null;

  constructor(
    private invoicesService: InvoicesService,
    private dialog: MatDialog,
    private toastService: NgxToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.receiptTypeId = this.route.snapshot.params['receiptTypeId'];
    console.log(this.receiptTypeId);
  } // Datos
  invoices: IInvoiceDocument[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  currentBranchId: string = '';

  // Configuración de columnas
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: false, type: 'index', width: '80px' },
    { key: 'receiptTypeName', label: 'Comprobante', sortable: true },
    { key: 'documentNumber', label: 'Documento', sortable: true },
    { key: 'companyRuc', label: 'RUC', sortable: true },
    { key: 'customerName', label: 'Cliente', sortable: true },
    { key: 'status', label: 'Estado SUNAT', sortable: true },
  ];

  // Acciones de la tabla
  actions: TableAction[] = [
    {
      icon: 'pdf-icon',
      tooltip: 'Descargar PDF',
      color: 'primary',
      isSvg: true,
      callback: (row: IInvoiceDocument) => this.downloadPDF(row),
    },
    {
      icon: 'xml-icon',
      tooltip: 'Descargar XML',
      color: 'primary',
      isSvg: true,
      callback: (row: IInvoiceDocument) => this.downloadXML(row),
    },
    {
      icon: 'cdr-icon',
      tooltip: 'Descargar CDR',
      color: 'primary',
      isSvg: true,
      callback: (row: IInvoiceDocument) => this.downloadCDR(row),
    },
    {
      icon: 'sunat-info-icon',
      tooltip: 'Información SUNAT',
      color: 'primary',
      isSvg: true,
      callback: (row: IInvoiceDocument) => this.showSunatInfo(row),
    },
  ];

  async downloadPDF(invoice: IInvoiceDocument) {
    const dialogRef = this.dialog.open(GeneratePdfComponent, {
      width: '450px',
      data: invoice,
    });

    const format = await firstValueFrom(dialogRef.afterClosed());
    if (!format) return;

    try {
      this.loading = true;
      const [blob] = await Promise.all([
        firstValueFrom(
          this.invoicesService.generatePdf({
            invoiceId: invoice.invoiceId,
            format: format,
          }),
        ),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      const url = window.URL.createObjectURL(blob);
      this.downloadFile(
        url,
        `${invoice.companyRuc}-${invoice.documentNumber}.pdf`,
      );
      window.URL.revokeObjectURL(url);
      this.toastService.success({
        title: 'Completado',
        messages: ['El PDF se ha descargado correctamente'],
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      this.loading = false;
    }
  }

  async downloadXML(invoice: IInvoiceDocument) {
    try {
      this.loading = true;
      const [blob] = await Promise.all([
        firstValueFrom(this.invoicesService.generateXml(invoice.invoiceId)),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      const url = window.URL.createObjectURL(blob);
      this.downloadFile(
        url,
        `${invoice.companyRuc}-${invoice.documentNumber}.xml`,
      );
      window.URL.revokeObjectURL(url);
      this.toastService.success({
        title: 'Completado',
        messages: ['El XML se ha descargado correctamente'],
      });
    } catch (error) {
      console.error('Error descargando XML:', error);
      this.toastService.error({
        title: 'Error',
        messages: ['No se pudo generar el XML'],
      });
    } finally {
      this.loading = false;
    }
  }

  async downloadCDR(invoice: IInvoiceDocument) {
    try {
      this.loading = true;
      const [blob] = await Promise.all([
        firstValueFrom(this.invoicesService.generateCdr(invoice.invoiceId)),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      const url = window.URL.createObjectURL(blob);
      this.downloadFile(
        url,
        `R-${invoice.companyRuc}-${invoice.documentNumber}.xml`,
      );
      window.URL.revokeObjectURL(url);
      this.toastService.success({
        title: 'Completado',
        messages: ['El CDR se ha descargado correctamente'],
      });
    } catch (error) {
      console.error('Error descargando CDR:', error);
      this.toastService.error({
        title: 'Error',
        messages: ['No se pudo generar el CDR'],
      });
    } finally {
      this.loading = false;
    }
  }

  showSunatInfo(invoice: IInvoiceDocument) {
    this.dialog.open(SunatDetailsComponent, {
      width: '600px',
      data: invoice,
    });
  }

  private downloadFile(url: string, fileName: string) {
    const link = document.body.appendChild(document.createElement('a'));
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.click();
    link.remove();
  }

  onParamsChange(params: PaginationParams): void {
    this.isInitialLoad = false;
    this.loadInvoices(params);
  }

  onActionClick(event: { action: string; row: IInvoiceDocument }): void {
    console.log('Acción:', event.action, 'Fila:', event.row);

    switch (event.action) {
      case 'edit':
        console.log('Editar rol:', event.row.id);
        break;
      case 'delete':
        this.deleteSerie(event.row);
        break;
    }
  }
  private isInitialLoad = true;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.receiptTypeId = params['receiptTypeId'] || null;
      if (!this.isInitialLoad) {
        this.loadInvoices({
          page: 1,
          limit: 10,
        });
      }
    });
  }

  deleteSerie(invoice: IInvoiceDocument) {
    // Swal.fire({
    //   title: '¿Estás seguro?',
    //   text: 'No podrás revertir esto',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Sí, eliminar',
    //   cancelButtonText: 'Cancelar',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.loading = true;
    //     this.seriesService
    //       .deleteSerie(serie.id)
    //       .pipe(
    //         finalize(() => (this.loading = false)),
    //         tap((response) => {
    //           this.ngxToastService.success({
    //             title: 'Eliminado',
    //             messages: ['La serie ha sido eliminada correctamente'],
    //           });
    //           this.loadSeries({
    //             page: 1,
    //             limit: 10,
    //           });
    //         }),
    //         catchError((error) => {
    //           this.ngxToastService.error({
    //             title: 'Error',
    //             messages: [
    //               error.error?.message ||
    //                 'Ocurrió un error al eliminar la serie',
    //             ],
    //           });
    //           return of(null);
    //         })
    //       )
    //       .subscribe();
    //   }
    // });
  }

  private async loadInvoices(params: PaginationParams): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.invoicesService.getInvoices({
          ...params,
          receiptTypeId: this.receiptTypeId,
        } as any),
      );
      this.invoices = response.data.items;
      this.totalItems = response.data.totalItems;
    } catch (error) {
      console.error('Error cargando series', error);
      this.invoices = [];
      this.totalItems = 0;
    } finally {
      this.loading = false;
    }
  }

  onAddClick() {
    this.router.navigate(['admin', 'facturas', this.receiptTypeId, '0']);
  }
}
