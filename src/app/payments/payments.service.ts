import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private http: HttpClient
  ) { }
  getPayments(): Observable<Payments[]> {
    return this.http.get<Payments[]>(environment.api + '/payments/user', { withCredentials: true })
      .pipe(
        tap(data => console.log('Payments :', JSON.stringify(data))),
        catchError(this.handleError)
      );
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

export interface Payments {
  id: number;
  customer_id: number;
  worker_id: number;
  transaction_id: number;
  amount: string;
  updated_at: string;
}
