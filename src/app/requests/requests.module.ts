import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';
import { RequestComponent } from './request/request.component';
import { RequestThumbnailComponent } from './request-thumbnail/request-thumbnail.component';
import { ReviewComponent } from './review/review.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestsPageRoutingModule
  ],
  declarations: [
    RequestsPage,
    RequestComponent,
    RequestThumbnailComponent,
    ReviewComponent
  ]
})
export class RequestsPageModule { }
