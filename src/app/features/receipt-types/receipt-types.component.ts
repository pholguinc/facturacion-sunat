import { Component } from '@angular/core';
import {
  DatatableComponent,
  PaginationParams,
  TableAction,
  TableColumn,
} from '@/shared/datatable/datatable.component';
import { IReceiptType } from './interfaces/receipt-types.interface';
import { firstValueFrom } from 'rxjs';
import { ReceiptTypesService } from './services/receipt-type.service';

@Component({
  selector: 'app-receipt-types',
  imports: [DatatableComponent],
  templateUrl: './receipt-types.component.html',
  styleUrl: './receipt-types.component.scss',
})
export class ReceiptTypesComponent {
  constructor(private receiptTypesService: ReceiptTypesService) {}
  // Datos
  receiptTypes: IReceiptType[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  currentBranchId: string = '';

  // Configuración de columnas
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: false, type: 'index', width: '80px' },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'code', label: 'Código', sortable: true },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      type: 'boolean',
      width: '100px',
    },
  ];

  onParamsChange(params: PaginationParams): void {
    this.loadReceiptTypes(params);
  }

  private async loadReceiptTypes(params: PaginationParams): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.receiptTypesService.getReceiptTypes(params)
      );
      this.receiptTypes = response.data.items;
      this.totalItems = response.data.totalItems;
    } catch (error) {
      console.error('Error cargando tipos de comprobantes', error);
      this.receiptTypes = [];
      this.totalItems = 0;
    } finally {
      this.loading = false;
    }
  }
}
