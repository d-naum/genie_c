import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;
  constructor(
    private router: Router,
    private requestService: RequestsService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.reviewForm = this.fb.group({
      id: [+this.activatedRoute.snapshot.params['id']],
      rating: [],
      feedback: []
    });
  }
  submitReview(formvalues) {
    this.requestService.reviewTransaction(formvalues).subscribe(async res => {
      const toast = await this.toastController.create({
        header: res.title,
        message: res.message,
        duration: 2000
      });
      this.reviewForm.reset();
      toast.present();
      this.router.navigate(['home']);
    });
  }

}
