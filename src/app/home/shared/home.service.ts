import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Category, SubCategory } from './category';
import { tap, catchError, map } from 'rxjs/operators';
import { LoginService } from 'src/app/login/shared/login.service';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private categoryUrl = environment.api + '/services';
  private maxTransaction = environment.api + '/transactions/max';
  private requestsUrl = environment.api + '/transactions/user';
  categoryVal: any;
  userVal: any;

  constructor(
    private http: HttpClient
  ) {
  }

  // getCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(this.CategoryUrl);
  // }

  categories$ = this.http.get<Category[]>(this.categoryUrl)
    .pipe(
      tap(data => console.log('Category :', JSON.stringify(data))),
      catchError(this.handleError)
    );
  // user$ = this.loginService.currentId$.subscribe(val => {
  //   this.http.get<SubCategory[]>(this.categoryUrl + '/' + val + '/subservices')
  //     .pipe(
  //       tap(data => console.log('User :', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // });

  // get user value
  profile$ = this.http.get<User>(environment.api + '/users/profile', { withCredentials: true })
    .pipe(
      tap(data => console.log('profile :', JSON.stringify(data))),
      catchError(this.handleError)
    );

  subCategories(value): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.categoryUrl + '/' + value + '/subservices')
      .pipe(
        tap(data => console.log('SubCategory :', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }





  // subCategories$ = this.http.get<SubCategory[]>(this.categoryUrl + +'/subservices')
  //   .pipe(
  //     tap(data => console.log('SubCategory :', JSON.stringify(data))),
  //     catchError(this.handleError)
  //   );
 // address observable
 private address$ = new BehaviorSubject('');
 currentaddress$ = this.address$.asObservable();

 address(value) {
   this.address$.next(value);
 }
  // Behaviour Subject SubCategory
  private subCategory$ = new BehaviorSubject('');
  currentSubCategory$ = this.subCategory$.asObservable();

  subCategory(value) {
    this.subCategory$.next(value);
  }
  // Behaviour Subject Category

  private category$ = new BehaviorSubject('');
  currentCategory$ = this.category$.asObservable();

  categoryValue(value) {
    this.category$.next(value);
  }
  // transactions or Request
  maxVal(): Observable<any> {
    return this.http.get<any>(this.maxTransaction, { withCredentials: true })
      .pipe(
        tap(data => console.log('max value :', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  // sending request
  sendRequest(values: Request): Observable<any> {
    // const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), withCredentials: true };
    return this.http.post<any>(this.requestsUrl, values, { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  updateName(value): Observable<any> {
    return this.http.post<any>(environment.api + '/users/update/name', value, { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  createTransactionPayment(value): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/payment', value, { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  createTransactionReview(value): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/review', value, { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  searchWorkers(value): Observable<any> {
    return this.http.post<any>(environment.api + '/transactions/assign', value, { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): Observable<Status> {
    return this.http.get<Status>(environment.api + '/users/login', { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  logout(): Observable<Logout> {
    return this.http.get<Logout>(environment.api + '/users/logout', { withCredentials: true }).pipe(
      tap(data => console.log(JSON.stringify(data))),
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
export interface Status {
  isLoggedIn: boolean;
  id?: number;
}
export interface Logout {
  message: string;
}
export interface User {
  name: string;
  address: string;
}
