import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/** this control value must be equal to given control's value */
export const PasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMatched: true } ;
  };