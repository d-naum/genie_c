import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Payments, PaymentsService } from './payments.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsPage {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  constructor(
    private paymentService: PaymentsService
  ) { }
  payments$ = this.paymentService.getPayments().pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );


}
