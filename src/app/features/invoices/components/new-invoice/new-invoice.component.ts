import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchableSelectComponent } from '@/app/shared/searchable-select/searchable-select.component';
import { InvoicesService } from '../../services/invoices.service';
import { CompaniesService } from '@/app/features/companies/services/companies.service';
import { SeriesService } from '@/app/features/series-correlatives/services/series.service';
import { ReceiptTypesService } from '@/app/features/receipt-types/services/receipt-type.service';
import { NgxToastService } from '@angular-magic/ngx-toast';
import { catchError, finalize, firstValueFrom, map, of, tap } from 'rxjs';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-new-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SearchableSelectComponent,
    MatDatepickerToggle,
    MatDatepicker,
  ],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss',
})
export class NewInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  receiptTypes: any[] = [];
  series: any[] = [];

  receiptTypeId: string = '';
  loading: boolean = false;
  loadingData: boolean = true;
  currentBranch: string = '';

  // Series Pagination
  seriesPage = 1;
  seriesLimit = 3;
  seriesLoading = false;
  seriesHasMore = true;
  seriesSearchTerm = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoicesService: InvoicesService,
    private companiesService: CompaniesService,
    private seriesService: SeriesService,
    private receiptTypesService: ReceiptTypesService,
    private toastService: NgxToastService,
    private authService: AuthService,
  ) {
    this.invoiceForm = this.fb.group({
      company: [''],
      branch: [''],
      fechaEmision: [new Date(), Validators.required],
      currency: ['PEN', NgxValidators.required()],
      receiptTypeId: ['', NgxValidators.required()],
      documentSeriesId: ['', NgxValidators.required()],
      correlative: ['', NgxValidators.required()],
      paymentTerm: ['Contado', NgxValidators.required()],
      operationType: ['0101', NgxValidators.required()],
      sale: this.fb.group({
        moneda_id: ['1', NgxValidators.required()],
        forma_pago_id: ['1', NgxValidators.required()],
        codigo_documento: ['', NgxValidators.required()],
      }),
      customer: this.fb.group({
        razon_social_nombres: ['', NgxValidators.required()],
        numero_documento: ['', NgxValidators.required()],
        cliente_direccion: [''],
        ubigeo: ['140101'],
      }),
      items: this.fb.array([]),
    });
    this.currentBranch = this.authService.getPayload().branchId;
    console.log('currentBranch', this.currentBranch);
    this.loadReceiptTypeByBranch(this.currentBranch);
    this.invoiceForm.controls['company'].disable();
    this.invoiceForm.controls['branch'].disable();
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.receiptTypeId = params['receiptTypeId'];
    });

    const branch = this.loadCompanyByBranch(this.currentBranch);
    console.log('branch', branch);
    this.loadSeries('', 1);
    this.addItem(); // Add one initial item

    this.invoiceForm
      .get('documentSeriesId')
      ?.valueChanges.subscribe((seriesId) => {
        if (seriesId) {
          const selectedSeries = this.series.find((s) => s.value === seriesId);
          console.log('selectedSeries', selectedSeries);
          if (selectedSeries) {
            this.invoiceForm.patchValue({
              correlative: selectedSeries.correlative,
            });
          }
        }
      });
  }

  loadSeries(term: string = '', page: number = 1) {
    if (this.seriesLoading) return;

    this.seriesLoading = true;
    this.seriesSearchTerm = term;
    this.seriesPage = page;

    const params = {
      branchId: this.currentBranch,
      search: term,
      page: page,
      limit: this.seriesLimit,
    };

    this.seriesService.getSeries(params).subscribe({
      next: (response) => {
        const newSeries = response.data.items.map((s: any) => ({
          label: s.serie,
          value: s.id,
          correlative: s.correlative,
        }));

        if (page === 1) {
          this.series = newSeries;
        } else {
          this.series = [...this.series, ...newSeries];
        }

        this.seriesHasMore = page < response.data.totalPages;
        this.seriesLoading = false;
      },
      error: () => {
        this.seriesLoading = false;
      },
    });
  }

  onSearchSeries(term: string) {
    this.loadSeries(term, 1);
  }

  onLoadMoreSeries() {
    if (this.seriesHasMore && !this.seriesLoading) {
      this.loadSeries(this.seriesSearchTerm, this.seriesPage + 1);
    }
  }

  loadCompanyByBranch(branchId: string) {
    this.loadingData = true;
    this.companiesService
      .getCompanyByBranchId(branchId)
      .pipe(
        tap((company) => {
          console.log('company', company);
          this.invoiceForm.patchValue({
            company: company.data.razonSocial,
            branch: company.data.branchName,
          });
        }),
        catchError((error) => {
          console.error('Error loading company:', error);
          this.toastService.error({
            title: 'Error',
            messages: ['No se pudo encontrar la empresa para esta sucursal'],
          });
          return of(null);
        }),
        finalize(() => {
          this.loadingData = false;
        }),
      )
      .subscribe();
  }

  loadReceiptTypeByBranch(branchId: string) {
    this.loadingData = true;
    this.receiptTypesService
      .getReceiptTypeByBranchId(branchId)
      .pipe(
        tap((receiptType) => {
          this.receiptTypes = receiptType.data.map((rt) => ({
            label: rt.name,
            value: rt.id,
          }));
        }),
        catchError((error) => {
          console.error('Error loading receipt type:', error);
          this.toastService.error({
            title: 'Error',
            messages: [
              'No se pudo encontrar el tipo de comprobante para esta sucursal',
            ],
          });
          return of(null);
        }),
        finalize(() => {
          this.loadingData = false;
        }),
      )
      .subscribe();
  }

  addItem() {
    const itemForm = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['1', [Validators.required, Validators.min(1)]],
      mtoPrecioUnitario: ['0', [Validators.required, Validators.min(0)]],
      codigo_producto: [''],
      tipo_afectacion_igv: ['10', Validators.required],
      mtoIgv: [0],
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  async onSubmit() {
    if (this.invoiceForm.invalid) {
      this.toastService.error({
        title: 'Error',
        messages: ['Por favor complete todos los campos requeridos'],
      });
      return;
    }

    try {
      this.loading = true;
      const formData = {
        ...this.invoiceForm.value,
        companyId: this.authService.getPayload().companyId,
        branchId: this.currentBranch,
      };

      // Ensure numeric values are strings if required by the API
      formData.items = formData.items.map((item: any) => ({
        ...item,
        cantidad: item.cantidad.toString(),
        mtoPrecioUnitario: item.mtoPrecioUnitario.toString(),
      }));

      await firstValueFrom(this.invoicesService.createInvoice(formData));

      this.toastService.success({
        title: 'Éxito',
        messages: ['Comprobante creado correctamente'],
      });
      this.router.navigate(['../../'], { relativeTo: this.route });
    } catch (error) {
      console.error('Error creating invoice:', error);
      this.toastService.error({
        title: 'Error',
        messages: ['Ocurrió un error al crear el comprobante'],
      });
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
