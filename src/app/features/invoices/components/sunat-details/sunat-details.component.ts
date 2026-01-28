import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { IInvoiceDocument } from '../../interfaces/invoice-document.interface';

@Component({
  selector: 'app-sunat-details',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ControlErrorsDirective,
  ],
  templateUrl: './sunat-details.component.html',
  styleUrl: './sunat-details.component.scss',
})
export class SunatDetailsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SunatDetailsComponent>);
  readonly data = inject<IInvoiceDocument>(MAT_DIALOG_DATA);

  form = new FormGroup({
    documentNumber: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '', disabled: true }),
    respuestaSunat: new FormControl({ value: '', disabled: true }),
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        documentNumber: this.data.documentNumber,
        status: this.data.status,
        respuestaSunat: this.data.respuestaSunat,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
