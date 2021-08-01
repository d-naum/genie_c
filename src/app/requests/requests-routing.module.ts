import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestComponent } from './request/request.component';

import { RequestsPage } from './requests.page';
import { ReviewComponent } from './review/review.component';

const routes: Routes = [
  {
    path: '',
    component: RequestsPage
  },
  {
    path: 'request/:id',
    component: RequestComponent
  },
  {
    path: 'review/:id',
    component: ReviewComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsPageRoutingModule { }
