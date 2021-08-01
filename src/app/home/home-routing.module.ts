import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SubSearchComponent } from './sub-search/sub-search.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { LoginGuard } from '../login/login.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'subservice/:id',
    component: SubSearchComponent
  },
  {
    path: 'request/:id',
    component: RequestFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
