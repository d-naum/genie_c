import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, User } from '../shared/home.service';
import { Category } from './../shared/category';
import { Subject, EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-sub-search',
  templateUrl: './sub-search.component.html',
  styleUrls: ['./sub-search.component.scss'],
})
export class SubSearchComponent implements OnInit {
  user: User;
  subCategory: any;
  subCategories$: Observable<Category[]>;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) { }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  ngOnInit() {
    this.homeService.currentCategory$.pipe(first()).subscribe(val => {
      console.log(val);
      this.subCategory = val;
    });
    this.homeService.categoryValue(+this.activatedRoute.snapshot.params['id']);
    // this.subCategories$ = this.homeService.subCategories$.pipe(
    //   catchError(err => {
    //     this.errorMessageSubject.next(err);
    //     return EMPTY;
    //   })
    // );
    this.subCategories$ = this.homeService.subCategories(this.subCategory || + this.activatedRoute.snapshot.params['id']).pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );
  }
  navigateSub(subCategory) {
    this.router.navigate(['home/request/' + this.activatedRoute.snapshot.params['id']]);
    this.homeService.subCategory(subCategory);
  }
  navigateBack() {
    this.router.navigate(['home']);
  }
}
