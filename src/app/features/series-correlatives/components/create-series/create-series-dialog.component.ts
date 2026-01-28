import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchableSelectComponent } from '@/app/shared/searchable-select/searchable-select.component';
import { ReceiptTypesService } from '@/app/features/receipt-types/services/receipt-type.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-create-series-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    SearchableSelectComponent,
    CommonModule,
  ],
  templateUrl: './create-series-dialog.component.html',
  styleUrl: './create-series-dialog.component.scss',
})
export class CreateSeriesDialogComponent implements OnInit {
  currentBranchId: string = '';
  private fb = inject(FormBuilder);
  private receiptTypesService = inject(ReceiptTypesService);
  readonly dialogRef = inject(MatDialogRef<CreateSeriesDialogComponent>);

  receiptTypes: any[] = [];
  seriesOptions: any[] = [
    { label: 'F001', value: 'F001' },
    { label: 'F002', value: 'F002' },
    { label: 'B001', value: 'B001' },
    { label: 'B002', value: 'B002' },
  ];

  seriesForm: FormGroup = this.fb.group({
    serie: ['', [NgxValidators.required('La serie es obligatorio')]],
    correlative: [
      '',
      [NgxValidators.required('El correlativo es obligatorio')],
    ],
    branchId: ['', [NgxValidators.required('La sucursal es obligatoria')]],
    receiptTypeId: [
      '',
      [NgxValidators.required('El Documento es obligatorio')],
    ],
  });

  constructor(private authService: AuthService) {
    this.currentBranchId = this.authService.getPayload()?.branchId;
  }

  ngOnInit() {
    this.loadReceiptTypes();
    this.seriesForm.patchValue({
      branchId: this.currentBranchId,
    });
  }

  loadReceiptTypes() {
    this.receiptTypesService
      .getReceiptTypeByBranchId(this.currentBranchId)
      .subscribe((response) => {
        this.receiptTypes = response.data.map((rt: any) => ({
          label: rt.name,
          value: rt.id,
        }));
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    console.log(
      'Save executed. Form:',
      this.seriesForm.value,
      'Valid:',
      this.seriesForm.valid,
    );
    if (this.seriesForm.invalid) {
      this.seriesForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.seriesForm.value);
  }
}
