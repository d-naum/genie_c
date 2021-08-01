import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FcmService } from '../shared/fcm.service';
import { Requests, RequestsService } from './requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsPage{
  active: boolean;
  constructor(
    private router: Router,
    private requestsService: RequestsService,
  ) {
    this.active = false;

  }
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  requests$= this.requestsService.requests$.pipe(
    tap(requests=>('requests:' + requests)),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  pendingRequests$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 0)),
    tap(data => console.log('pending:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  activeRequests$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 1)),
    tap(data => console.log('active:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  completedRequests$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 2 && myrequest.payment_status === 'paid' || myrequest.payment_status === 'fulfilled')),
    tap(data => console.log('completed:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  unPaidRequests$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 2 && myrequest.payment_status === 'unpaid')),
    tap(data => console.log('unpaid:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  requestedPaymentRequest$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 2 && myrequest.payment_status === 'requested')),
    tap(data => console.log('requestedPayment:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  declinedRequests$ = this.requests$.pipe(
    map(myRequests => myRequests.filter(myrequest => myrequest.status === 3)),
    tap(data => console.log('declined:', JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  navigateSub() {
    this.router.navigate(['requests/request']);
  }
  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    if (ev.detail.value === 'active') {
      this.active = false;
      console.log(this.active);
    }
    if (ev.detail.value === 'complete') {
      this.active = true;
      console.log(this.active);
    }
  }

}
