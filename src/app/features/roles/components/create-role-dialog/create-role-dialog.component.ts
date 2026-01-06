import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { getFormControlError } from '@/app/core/helpers/functions-form';

@Component({
  selector: 'app-create-role-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    ControlErrorsDirective,
    FormSubmitDirective,
  ],
  templateUrl: './create-role-dialog.component.html',
  styleUrl: './create-role-dialog.component.scss',
})
export class CreateRoleDialogComponent {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateRoleDialogComponent>);

  roleForm: FormGroup = this.fb.group({
    name: ['', [NgxValidators.required('El nombre del rol es obligatorio')]],
    description: [
      '',
      [NgxValidators.required('La descripción del rol es obligatoria')],
    ],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.roleForm.value);
  }

  getError(formControl: AbstractControl) {
    return getFormControlError(formControl);
  }
}
