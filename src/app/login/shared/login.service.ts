import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IonApp } from '@ionic/angular';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = environment.api + '/users/auth';
  constructor(
    private http: HttpClient
  ) { }
  // private isLoggedIn$ = new BehaviorSubject(false);
  // currentLoggedIn$ = this.isLoggedIn$.asObservable();

  // loggedInValue(value) {
  //   this.isLoggedIn$.next(value);
  // }
  private id$ = new BehaviorSubject(false);
  currentId$ = this.id$.asObservable();

  idValue(value) {
    this.id$.next(value);
  }


  // first we created dologin which is getting isloggedIn value with session id
  // then we are accessing it in loggedInStatus which is false by default
  // we will set this value in login page
  // we will send this to login gaurd for page refresh
  // with credential along with request is important
  // backend you need to have sessions
  private loggedInStatus = false;

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }
  get isLoggedIn() {
    return this.loggedInStatus;
  }

  doLogin(values): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.loginUrl, values, { withCredentials: true }).pipe(
      tap(data => {
        console.log(JSON.stringify(data));
      }),
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
