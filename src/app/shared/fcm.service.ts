import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const { PushNotifications } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }
  registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        PushNotifications.register();
      }
      else {
        // no permission granted
      }
    });
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('My Token :' + JSON.stringify(token));
        const value = {
          device_token: token.value
        };
        this.postToken(value).subscribe(res=>{
          console.log(res);
        });
      });
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('error :' + JSON.stringify(error));
    });
    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotification) => {
      console.log('Push Recieved :' + JSON.stringify(notification));
    });
    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: PushNotificationActionPerformed) => {
      const data = notification.notification.data;
      console.log('Action Performed' + JSON.stringify(notification.notification));
      if(data.id){
        this.router.navigateByUrl(`/request/${data.id}`);
      }
    });
  }
  postToken(value): Observable<any> {
    return this.http.post<any>(environment.api + '/users/notification', value, { withCredentials: true }).pipe(
      tap(data => console.log('notification :', JSON.stringify(data))),
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
