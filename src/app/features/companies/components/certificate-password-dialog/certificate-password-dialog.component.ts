import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-certificate-password-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    ControlErrorsDirective,
    MatIconModule,
  ],
  templateUrl: './certificate-password-dialog.component.html',
  styleUrl: './certificate-password-dialog.component.scss',
})
export class CertificatePasswordDialogComponent {
  hidePassword = true;
  passwordControl = new FormControl('', [
    NgxValidators.required('La contraseña es requerida'),
  ]);

  constructor(
    public dialogRef: MatDialogRef<CertificatePasswordDialogComponent>,
  ) {}

  onConfirm(): void {
    if (this.passwordControl.valid) {
      this.dialogRef.close(this.passwordControl.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
