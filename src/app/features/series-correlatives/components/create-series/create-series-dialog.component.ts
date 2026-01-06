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
  ],
  templateUrl: './create-series-dialog.component.html',
  styleUrl: './create-series-dialog.component.scss',
})
export class CreateSeriesDialogComponent {
  currentBranchId: string = '';
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateSeriesDialogComponent>);

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
    console.log('currentBranchId', this.currentBranchId);

    this.seriesForm.patchValue({
      branchId: this.currentBranchId,
      receiptTypeId: '0dcc2f3f-ae21-4ddd-b42c-a9c98dd5da07',
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
      this.seriesForm.valid
    );
    if (this.seriesForm.invalid) {
      this.seriesForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.seriesForm.value);
  }
}
