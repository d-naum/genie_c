import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { PasswordValidator } from './password-validator';

@Directive({
    selector: '[PasswordMatchRevealed]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }]
  })
  export class PasswordValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors {
      return PasswordValidator(control);
    }
  }