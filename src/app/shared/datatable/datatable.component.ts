import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?:
    | 'text'
    | 'date'
    | 'number'
    | 'boolean'
    | 'actions'
    | 'custom'
    | 'index';
  format?: (value: any, row: any) => string;
  width?: string;
}

export interface TableAction {
  icon: string;
  tooltip: string;
  color?: 'primary' | 'accent' | 'warn';
  action?: string;
  callback?: (row: any) => void;
  show?: (row: any) => boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { label: string; value: any }[];
  value?: any;
  placeholder?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss',
})
export class DatatableComponent<T = any>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inputs
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() data: T[] = [];
  @Input() totalItems: number = 0;
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() noDataMessage: string = 'No hay datos para mostrar';
  @Input() title: string = '';
  @Input() addButtonLabel: string = ''; // Si está vacío, no se muestra el botón
  @Input() filters: TableFilter[] = [];

  // Outputs
  @Output() paramsChange = new EventEmitter<PaginationParams>();
  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();
  @Output() addClick = new EventEmitter<void>();

  // Internal
  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  searchValue: string = '';
  currentPage: number = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupColumns();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    // Emit initial params
    setTimeout(() => {
      this.emitParams();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  private setupColumns(): void {
    this.displayedColumns = this.columns.map((col) => col.key);
    if (this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchValue = searchTerm;
        this.currentPage = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.emitParams();
      });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.emitParams();
  }

  onSortChange(sort: Sort): void {
    this.emitParams(sort);
  }

  onActionClick(action: TableAction, row: T): void {
    if (action.callback) {
      action.callback(row);
    } else if (action.action) {
      this.actionClick.emit({ action: action.action, row });
    }
  }

  isActionVisible(action: TableAction, row: T): boolean {
    return action.show ? action.show(row) : true;
  }

  private emitParams(sort?: Sort): void {
    const params: PaginationParams = {
      page: this.currentPage + 1, // Backend expects 1-indexed
      limit: this.pageSize,
    };

    // Add filters
    this.filters.forEach((filter) => {
      if (
        filter.value !== undefined &&
        filter.value !== null &&
        filter.value !== ''
      ) {
        params[filter.key] = filter.value;
      }
    });

    if (this.searchValue) {
      params.search = this.searchValue;
    }

    if (sort?.active && sort?.direction) {
      params.sortBy = sort.active;
      params.sortOrder = sort.direction as 'asc' | 'desc';
    }

    this.paramsChange.emit(params);
  }

  // Helper methods for template
  getValue(row: T, column: TableColumn): string {
    const value = this.resolveValue(row, column.key);

    if (column.format) {
      return column.format(value, row);
    }

    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('es-PE');
    }

    if (column.type === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    return value ?? '-';
  }

  resolveValue(row: any, key: string): any {
    // Log specifically for boolean/isActive to minimize noise
    const isTarget = key === 'isActive';

    let value;
    if (!key.includes('.')) {
      value = row[key];
    } else {
      value = key
        .split('.')
        .reduce((acc, part) => (acc ? acc[part] : undefined), row);
    }

    return value;
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchSubject.next('');
  }

  refresh(): void {
    this.emitParams();
  }
}
