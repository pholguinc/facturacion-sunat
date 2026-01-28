import { Component } from '@angular/core';
import {
  DatatableComponent,
  PaginationParams,
  TableAction,
  TableColumn,
} from '@/shared/datatable/datatable.component';
import { ICompany } from './interfaces/companies.interface';
import { CompaniesService } from './services/companies.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  imports: [DatatableComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent {
  constructor(
    private companiesService: CompaniesService,
    private router: Router
  ) {}
  // Datos
  companies: ICompany[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  currentBranchId: string = '';

  // Configuración de columnas
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: false, type: 'index', width: '80px' },
    { key: 'razonSocial', label: 'Razon Social', sortable: true },
    { key: 'numeroDocumento', label: 'Número Documento', sortable: true },
    { key: 'domicilioFiscal', label: 'Domicilio Fiscal', sortable: true },
    { key: 'ubigeo', label: 'Ubigeo', sortable: true },
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
      callback: (row: ICompany) => console.log(row),
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      color: 'warn',
      callback: (row: ICompany) => console.log(row),
    },
  ];

  onParamsChange(params: PaginationParams): void {
    this.loadSeries(params);
  }

  onActionClick(event: { action: string; row: ICompany }): void {
    console.log('Acción:', event.action, 'Fila:', event.row);

    switch (event.action) {
      case 'edit':
        this.router.navigate(['features/empresas', event.row.id]);
        break;
      case 'delete':
        console.log('Eliminar rol:', event.row.id);
        break;

      case 'create':
        this.onCreate();
        break;
    }
  }

  private async loadSeries(params: any): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.companiesService.getCompanies(params)
      );
      this.companies = response.data.items;
      this.totalItems = response.data.totalItems;
    } catch (error) {
      console.error('Error cargando empresas', error);
      this.companies = [];
      this.totalItems = 0;
    } finally {
      this.loading = false;
    }
  }

  onCreate() {
    this.router.navigate(['admin/empresas/0']);
  }
}
