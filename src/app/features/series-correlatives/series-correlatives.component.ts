import {
  DatatableComponent,
  PaginationParams,
  TableAction,
  TableColumn,
  TableFilter,
} from '@/app/shared/datatable/datatable.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  catchError,
  finalize,
  firstValueFrom,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { SeriesService } from './services/series.service';
import { AuthService } from '../auth/services/auth.service';
import { NgxToastService, NgxToastModule } from '@angular-magic/ngx-toast';
import { Serie, SerieCreateRequest } from './interfaces/series.interface';
import { CreateRoleDialogComponent } from '../roles/components/create-role-dialog/create-role-dialog.component';
import { CreateSeriesDialogComponent } from './components/create-series/create-series-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-series-correlatives',
  imports: [
    CommonModule,
    DatatableComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxToastModule,
  ],
  templateUrl: './series-correlatives.component.html',
  styleUrl: './series-correlatives.component.scss',
})
export class SeriesCorrelativesComponent implements OnInit {
  filters: TableFilter[] = [
    {
      key: 'company',
      label: 'Empresa',
      options: [],
    },
    {
      key: 'branchId',
      label: 'Sucursal',
      options: [],
    },
    {
      key: 'isActive',
      label: 'Estado',
      options: [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ],
    },
  ];

  constructor(
    private seriesService: SeriesService,
    private authService: AuthService,
    private ngxToastService: NgxToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadFilters();
  }

  private loadFilters() {
    // Datos estáticos para prueba
    const branchOptions = [
      {
        label:
          'AV MATIAS MANZANILLA NRO. 518 DPTO. 402 - PERU - ICA - ICA - ICA',
        value: '31313',
      },
      { label: 'Sucursal Norte', value: 'B002' },
    ];
    const companyOptions = [
      { label: 'JM DISTRIBUCIONES SAC', value: 'C001' },
      { label: 'Otra Empresa', value: 'C002' },
    ];

    const branchFilter = this.filters.find((f) => f.key === 'branchId');
    if (branchFilter) {
      branchFilter.options = branchOptions;
    }

    const companyFilter = this.filters.find((f) => f.key === 'company');
    if (companyFilter) {
      companyFilter.options = companyOptions;
    }
  }
  // Datos
  series: any[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  currentBranchId: string = '';

  // Configuración de columnas
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: false, type: 'index', width: '80px' },
    {
      key: 'company.razonSocial',
      label: 'Razon Social',
      sortable: true,
    },
    { key: 'company.ruc', label: 'RUC', sortable: true },
    { key: 'branch.name', label: 'Sucursal', sortable: true },
    { key: 'receiptType.name', label: 'Documento', sortable: true },
    { key: 'serie', label: 'Serie', sortable: true },
    { key: 'correlative', label: 'Correlativo', sortable: true },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      type: 'boolean',
      width: '100px',
    },
  ];

  // Acciones de la tabla
  actions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar',
      color: 'primary',
      callback: (row: Serie) => console.log(row),
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      color: 'warn',
      callback: (row: Serie) => this.deleteSerie(row),
    },
  ];

  onAddClick() {
    const dialogRef = this.dialog.open(CreateSeriesDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const request: SerieCreateRequest = {
          branchId: result.branchId,
          receiptTypeId: result.receiptTypeId,
          serie: result.serie,
          correlative: result.correlative,
        };

        this.loading = true;

        timer(1500)
          .pipe(
            switchMap(() => this.seriesService.createSerie(request)),
            tap((response) => {
              console.log('✅ Service Response:', response);
              this.ngxToastService.success({
                title: 'Correcto',
                messages: [response.data?.message || ''],
                delay: 2000,
              });
              this.loadSeries({
                page: 1,
                limit: 10,
              });
            }),
            catchError((error) => {
              console.error('❌ Service Error:', error);
              this.ngxToastService.error({
                title: 'Error',
                messages: [
                  error.error?.message || error.message || 'Error desconocido',
                ],
              });
              return of(null);
            }),
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe();
      }
    });
  }

  onParamsChange(params: PaginationParams): void {
    this.loadSeries(params);
  }

  onActionClick(event: { action: string; row: Serie }): void {
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

  deleteSerie(serie: Serie) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.seriesService
          .deleteSerie(serie.id)
          .pipe(
            finalize(() => (this.loading = false)),
            tap((response) => {
              this.ngxToastService.success({
                title: 'Eliminado',
                messages: ['La serie ha sido eliminada correctamente'],
              });
              this.loadSeries({
                page: 1,
                limit: 10,
              });
            }),
            catchError((error) => {
              this.ngxToastService.error({
                title: 'Error',
                messages: [
                  error.error?.message ||
                    'Ocurrió un error al eliminar la serie',
                ],
              });
              return of(null);
            })
          )
          .subscribe();
      }
    });
  }

  private async loadSeries(params: any): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.seriesService.getSeries(params)
      );
      this.series = response.data.items;
      this.totalItems = response.data.totalItems;
    } catch (error) {
      console.error('Error cargando series', error);
      this.series = [];
      this.totalItems = 0;
    } finally {
      this.loading = false;
    }
  }
}
