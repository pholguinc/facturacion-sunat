import {
  AbstractControl,
  FormArray,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const VALIDATOR_MESSAGE_DEFAULT = {
  required: 'Este campo es obligatorio',
  email: 'Ingrese un Email valido',
  min: 'El valor debe tener al menos ${min} caracteres',
  max: 'El valor no debe tener más de ${max} caracteres',
  text: 'Este campo solo puede contener letras',
  number: 'Este campo solo puede contener números enteros positivos',
  phone: 'Ingrese un teléfono válido',
  ruc: 'Ingrese un RUC válido',
  maxDate: 'La fecha no puede ser mayor a la fecha actual',
  range: 'El valor debe estar entre ${min} y ${max}',
  passwordMismatch: 'Las contraseñas no coinciden',
};

export class NgxValidators {
  static required(message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.required(control);
      return error ? { required: this._getMessage('required', message) } : null;
    };
  }

  static email(message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.email(control);
      return error ? { email: this._getMessage('email', message) } : null;
    };
  }

  static min(min: number, message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.minLength(min)(control);
      return error
        ? {
            minLength: this._getMessage('min', message, [
              { min, current: control.value.length },
            ]),
          }
        : null;
    };
  }

  static max(max: number, message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.maxLength(max)(control);
      return error
        ? {
            maxLength: this._getMessage('max', message, [
              { max, current: control.value.length },
            ]),
          }
        : null;
    };
  }

  static text(message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;

      // Permitir null o cadena vacía
      if (value === null || value === '') {
        return null;
      }

      const regex = /^[A-Za-z\s]+$/;
      const isValid = regex.test(value);

      return !isValid ? { text: this._getMessage('text', message) } : null;
    };
  }

  static number(message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;

      // Permitir null o cadena vacía
      if (value === null || value === '') {
        return null;
      }

      const regex = /^[0-9]+$/; // Solo números enteros positivos
      const isValid = regex.test(value);

      return !isValid ? { number: this._getMessage('number', message) } : null;
    };
  }

  static ruc(message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      const regex = /^[0-9]{11}$/;
      const error = regex.test(control.value);
      return !error ? { ruc: this._getMessage('ruc', message) } : null;
    };
  }

  static range(min: number, max: number, message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;

      if (value === null || value === '') {
        return null;
      }

      const numValue = Number(value);

      if (isNaN(numValue) || numValue < min || numValue > max) {
        const msg = this._getMessage('range', message, [{ min, max }]);
        return { range: msg };
      }

      return null;
    };
  }

  static phone(message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      const regex = /^\d{9}$/;
      const error = regex.test(control.value);
      return !error ? { phone: this._getMessage('phone', message) } : null;
    };
  }

  static passwordMatch(
    passwordControlName: string,
    confirmPasswordControlName: string,
    message?: string
  ): ValidatorFn {
    return (group: AbstractControl) => {
      const passwordControl = group.get(passwordControlName);
      const confirmPasswordControl = group.get(confirmPasswordControlName);

      if (!passwordControl || !confirmPasswordControl) return null;

      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password && confirmPassword && password !== confirmPassword) {
        confirmPasswordControl.setErrors({
          passwordMismatch: this._getMessage('passwordMismatch', message),
        });
        return {
          passwordMismatch: this._getMessage('passwordMismatch', message),
        };
      } else {
        if (confirmPasswordControl.hasError('passwordMismatch')) {
          confirmPasswordControl.setErrors(null);
        }
        return null;
      }
    };
  }

  private static _getMessage(
    control: keyof typeof VALIDATOR_MESSAGE_DEFAULT | 'required',
    message?: string,
    paramsMessage?: { [key: string]: unknown }[]
  ) {
    if (message) return message;

    let messageControl = VALIDATOR_MESSAGE_DEFAULT[control];
    const existParams = paramsMessage && paramsMessage.length > 0;

    if (existParams) {
      paramsMessage.forEach((params) => {
        Object.keys(params)
          .filter((key) => params[key])
          .forEach((key) => {
            messageControl = messageControl.replace(
              `\${${key}}`,
              params[key]!.toString()
            );
          });
      });

      return messageControl;
    }

    return messageControl;
  }

  static maxDateCurrent(message?: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      let selectedDate: Date;

      if (typeof control.value === 'string') {
        if (control.value.includes('/')) {
          const [day, month, year] = control.value.split('/').map(Number);
          selectedDate = new Date(year, month - 1, day);
        } else if (control.value.includes('-')) {
          selectedDate = new Date(control.value);
        } else {
          return null;
        }
      } else if (control.value instanceof Date) {
        selectedDate = control.value;
      } else {
        return null;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate > today
        ? { maxDate: this._getMessage('maxDate', message) }
        : null;
    };
  }

  static getValidatorsFromString(validationString: string): ValidatorFn[] {
    if (!validationString) return [];

    const rules = validationString.split(',').map((r) => r.trim());
    const validators: ValidatorFn[] = [];

    for (const rule of rules) {
      if (rule === 'required') validators.push(NgxValidators.required());
      else if (rule === 'text') validators.push(NgxValidators.text());
      else if (rule === 'number') validators.push(NgxValidators.number());
      else if (rule.startsWith('min:')) {
        const minVal = parseInt(rule.split(':')[1], 10);
        if (!isNaN(minVal)) validators.push(NgxValidators.min(minVal));
      } else if (rule.startsWith('max:')) {
        const maxVal = parseInt(rule.split(':')[1], 10);
        if (!isNaN(maxVal)) validators.push(NgxValidators.max(maxVal));
      } else if (rule === 'email') validators.push(NgxValidators.email());
      else if (rule === 'phone') validators.push(NgxValidators.phone());
      else if (rule === 'ruc') validators.push(NgxValidators.ruc());
    }

    return validators;
  }
}
