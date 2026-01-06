import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { map, catchError, of, tap } from 'rxjs';
import { getFormControlError } from '@/app/core/helpers/functions-form';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { NgxToastModule, NgxToastService } from '@angular-magic/ngx-toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    NgxToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngxToastService: NgxToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [NgxValidators.required('El campo es obligatorio')]],
      password: ['', [NgxValidators.required('El campo es obligatorio')]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value)
        .pipe(
          map((response) => {
            return response;
          }),
          tap((response) => {
            if (response && response.data && response.data.access_token) {
              this.authService.setToken(response.data.access_token);
              this.ngxToastService.success({
                title: 'Bienvenido',
                messages: ['Has iniciado sesión correctamente'],
                delay: 2000,
                destroy: () => {
                  this.router.navigate(['/admin/home']);
                },
              });
            }
          }),
          catchError((error) => {
            let message = 'Ocurrió un error inesperado';

            if (error.status === 0) {
              message =
                'No se pudo conectar con el servidor. Verifique su conexión.';
            } else if (error.error?.message) {
              message =
                typeof error.error.message === 'string'
                  ? error.error.message
                  : error.error.message[0];
            }

            this.ngxToastService.error({
              title: 'Error',
              messages: [message],
              delay: 3000,
            });
            return of(null);
          })
        )
        .subscribe();
    }
  }

  getError(formControl: AbstractControl) {
    return getFormControlError(formControl);
  }
}
