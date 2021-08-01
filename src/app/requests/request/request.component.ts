import { ChangeDetectionStrategy, Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestsService } from '../requests.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent {

  constructor(
    private router: Router,
    private requestService: RequestsService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    @Inject(DOCUMENT) private _document: Document,

  ) { }
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  request$ = this.requestService.getTransaction(+this.activatedRoute.snapshot.params['id']).pipe(
    tap(data => console.log(JSON.stringify(data), this.activatedRoute.snapshot.params['id'])),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  requestedPayment$ = this.requestService.getPayment(+this.activatedRoute.snapshot.params['id']).pipe(
    tap(data => console.log(JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  review$ = this.requestService.getReview(+this.activatedRoute.snapshot.params['id']).pipe(
    tap(data => console.log(JSON.stringify(data.status))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  fulfillPayment() {
    const val = {
      id: + this.activatedRoute.snapshot.params['id']
    };
    this.requestService.fulfillPayment(val).subscribe(async res => {
      const toast = await this.toastController.create({
        header: res.message,
        duration: 3000
      });
      toast.present();
      this.router.navigate(['requests']).then(() => {
        window.location.reload();
      });
    });
  }
  review() {
    this.router.navigate(['requests/review/' + this.activatedRoute.snapshot.params['id']]);
  }
  cancel() {
    const value = {
      id: this.activatedRoute.snapshot.params['id']
    };
    this.requestService.cancelTransaction(value).subscribe(async res => {
      const toast = await this.toastController.create({
        message: res.message,
        duration: 2000,
      });
      toast.present();
    })
  }
  navigateBack() {
    this.router.navigate(['requests']);
  }
}
