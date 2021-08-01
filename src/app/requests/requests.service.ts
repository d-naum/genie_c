import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HomeService } from '../home/shared/home.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private http: HttpClient
  ) { }
  requests$ = this.http.get<Requests[]>(environment.api + '/transactions/user', { withCredentials: true }).pipe(
    tap(data => console.log('Requests :', JSON.stringify(data))),
    catchError(this.handleError)
  );

  getTransaction(id): Observable<Requests> {
    return this.http.get<Requests>(environment.api + '/transactions/user/' + id, { withCredentials: true })
      .pipe(
        tap(data => console.log('Request :', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
  cancelTransaction(value): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/cancel', value, { withCredentials: true });
  }
  reviewTransaction(value: Review): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/review/', value, { withCredentials: true });
  }
  getReview(id): Observable<any> {
    return this.http.get<any>(environment.api + '/transactions/review/' + id, { withCredentials: true }).pipe(
      tap(data => console.log('review :', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  getPayment(value): Observable<any> {
    const val = {
      id: value
    };
    return this.http.post<any>(environment.api + '/payments/transaction', val, { withCredentials: true });
  }
  fulfillPayment(value): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/user/fulfill', value, { withCredentials: true });
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
export interface Requests {
  id: number;
  user_id: number;
  worker_id?: number;
  status: number;
  payment_status: string;
  service_id: number;
  sub_service_id: number;
  service?: string;
  sub_service?: string;
  workerName?: string;
  issue_id?: number;
  priority?: string;
  date?: string;
  time?: string;
  units?: string;
  genie?: string;
  address?: string;
  instructions?: string;
  address_type?: string;
  photo?: any;
  promoCode?: any;
  created_at?: any;
  updated_at?: any;
  worker_name?: string;
  service_title?: string;
  sub_service_title?: string;
}
export interface Review {
  id: number;
  rating: number;
  feedback?: string;
}