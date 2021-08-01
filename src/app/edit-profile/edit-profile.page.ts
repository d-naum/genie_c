import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HomeService } from '../home/shared/home.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editForm: FormGroup;
  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) { }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  profile$ = this.homeService.profile$.pipe(
    tap(data => this.editForm.patchValue({
      name: data.name
    })),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  ngOnInit() {
    this.editForm = this.fb.group({
      name: ['']
    });
  }
  changeName(formvalue) {
    this.homeService.updateName(formvalue).subscribe(async res => {
      const toast = await this.toastController.create({
        message: res.message,
        duration: 2000
      });
      toast.present();
    });
  }

}
