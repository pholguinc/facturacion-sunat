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
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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
  isSvg?: boolean;
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
  receiptTypeId?: string;
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

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    const pdfIcon = `<svg viewBox="-4 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z" fill="#EB5757"></path></svg>`;
    const xmlIcon = `<svg viewBox="-4 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path d="M5.112-.024c-2.803 0-5.074 2.272-5.074 5.074v53.841c0 2.803 2.271 5.074 5.074 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.606l-18.902-20.309h-31.946z" fill-rule="evenodd" clip-rule="evenodd" fill="#FC7B24"></path> <g fill-rule="evenodd" clip-rule="evenodd"> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#FB5C1B"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M19.371 53.848c-.217 0-.414-.089-.541-.27l-3.727-4.97-3.745 4.97c-.126.181-.323.27-.54.27-.396 0-.721-.306-.721-.72 0-.144.037-.306.145-.432l3.889-5.131-3.619-4.826c-.09-.126-.144-.27-.144-.414 0-.343.288-.721.72-.721.217 0 .433.108.576.288l3.439 4.627 3.439-4.646c.125-.18.324-.27.54-.27.378 0 .737.306.737.721 0 .144-.035.288-.125.414l-3.619 4.808 3.889 5.149c.09.126.127.27.127.415.001.396-.323.738-.72.738zm14.455-.018c-.414 0-.738-.324-.738-.738v-9.254l-4.033 9.759c-.055.143-.2.233-.379.233-.144 0-.287-.09-.342-.234l-4.016-9.759v9.254c0 .414-.324.738-.756.738-.414 0-.738-.324-.738-.738v-10.262c0-.648.559-1.207 1.242-1.207.486 0 .99.288 1.188.756l3.438 8.373 3.457-8.373c.199-.468.686-.756 1.189-.756.684 0 1.242.558 1.242 1.207v10.263c.002.414-.322.738-.754.738zm10.546-.108h-5.456c-.594 0-1.08-.486-1.08-1.081v-10.316c0-.396.324-.721.774-.721.396 0 .72.324.72.721v10.065h5.042c.36 0 .647.288.647.648.001.396-.287.684-.647.684z" fill="#ffffff"></path></svg>`;
    const cdrIcon = `<svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><path style="fill:#E2E5E7;" d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"></path> <path style="fill:#B0B7BD;" d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"></path> <polygon style="fill:#CAD1D8;" points="480,224 384,128 480,128 "></polygon> <path style="fill:#84BD5A;" d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16 V416z"></path> <g> <path style="fill:#FFFFFF;" d="M90.592,339.088c0-24.688,15.472-45.904,44.912-45.904c11.12,0,19.952,3.312,29.296,11.376 c3.456,3.184,3.824,8.832,0.368,12.4c-3.456,3.056-8.704,2.688-11.76-0.368c-5.248-5.504-10.624-7.024-17.904-7.024 c-19.696,0-29.168,13.936-29.168,29.536c0,15.872,9.328,30.464,29.168,30.464c7.28,0,14.064-2.96,19.952-8.192 c3.968-3.072,9.472-1.552,11.76,1.536c2.048,2.816,3.072,7.536-1.408,12.016c-8.96,8.336-19.696,9.984-30.32,9.984 C104.544,384.912,90.592,363.792,90.592,339.088z"></path> <path style="fill:#FFFFFF;" d="M195.056,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296 c58.464,0,57.184,88.528,1.152,88.528H195.056z M203.12,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H203.12z"></path> <path style="fill:#FFFFFF;" d="M302.592,375.68c0,11.12-17.008,11.52-17.008,0.256V303.28c0-4.464,3.456-7.808,7.664-7.808h34.032 c32.496,0,39.152,43.504,12.032,54.368l17.008,20.736c6.656,9.856-6.656,19.312-14.336,9.6l-19.312-27.648h-20.096v23.152H302.592z M302.592,337.824h24.688c16.64,0,17.664-26.864,0-26.864h-24.688V337.824z"></path> </g> <path style="fill:#CAD1D8;" d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"></path></svg>`;
    const sunatInfoIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#668aff"></path> </g></svg>`;

    this.iconRegistry.addSvgIconLiteral(
      'pdf-icon',
      this.sanitizer.bypassSecurityTrustHtml(pdfIcon),
    );
    this.iconRegistry.addSvgIconLiteral(
      'xml-icon',
      this.sanitizer.bypassSecurityTrustHtml(xmlIcon),
    );
    this.iconRegistry.addSvgIconLiteral(
      'cdr-icon',
      this.sanitizer.bypassSecurityTrustHtml(cdrIcon),
    );
    this.iconRegistry.addSvgIconLiteral(
      'sunat-info-icon',
      this.sanitizer.bypassSecurityTrustHtml(sunatInfoIcon),
    );
  }

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
