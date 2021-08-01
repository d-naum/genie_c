import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomeService } from './home/shared/home.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from './home/shared/home.service';
import { LoginService } from './login/shared/login.service';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FcmService } from './shared/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Requests',
      url: '/requests',
      icon: 'hammer'
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: 'wallet'
    },
    {
      title: 'More',
      url: '/more',
      icon: 'ellipsis-horizontal'
    }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private homeService: HomeService,
    private router: Router,
    private menu: MenuController
  ) {
    this.initializeApp();
  }
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  profile$ = this.homeService.profile$.pipe(
    tap(data => console.log(JSON.stringify(data))),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  logout() {
    this.homeService.logout().subscribe(val => {
      console.log(val);
      this.router.navigate(['login']);
      this.menu.close();
    });
  }
  edit() {
    this.router.navigate(['edit-profile']);
    this.menu.close();
  }
}
