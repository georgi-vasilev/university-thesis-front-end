import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (!value) return null;

    // If starts with 0 → must be exactly 10 digits
    if (/^0\d{9}$/.test(value)) return null;

    // If starts with + → must be + followed by exactly 11 digits
    if (/^\+\d{11}$/.test(value)) return null;

    return { invalidPhone: true };
  };
}

