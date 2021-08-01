import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, EMPTY, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { HomeService } from './shared/home.service';
import { Category } from './shared/category';
import { LoginService } from '../login/shared/login.service';
import { FcmService } from '../shared/fcm.service';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Plugins, Capacitor } from '@capacitor/core';
const { Geolocation } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  onChangeValue: any;
  selectedId = 'Cleaning';
  constructor(
    private router: Router,
    private homeService: HomeService,
    fcmService: FcmService,
  ) {
    fcmService.initPush();
    this.requestPermission();
  }


  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  categories$ = this.homeService.categories$.pipe(
    // map((categories: Category[]) => categories.filter(category =>
    //   this.selectedId ? category.title.toLowerCase() === this.selectedId : true
    // )),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  async requestPermission(){
    const permResult = await Plugins.Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
  }
  onSearch(e: any) {
    this.categories$ = this.homeService.categories$.pipe(
      map((categories: Category[]) => categories.filter(category =>
        e.detail.value ? category.title.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1 : true
      )),
      // e.detail.value ? category.title.toLowerCase() === e.detail.value.toLowerCase() : true
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  }
  navigateSub(categoryId) {
    this.router.navigate(['home/subservice/' + categoryId]);
    this.homeService.categoryValue(categoryId);
  }

}
