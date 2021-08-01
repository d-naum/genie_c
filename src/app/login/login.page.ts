import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './shared/login.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  async login(formvalues) {
    // if (this.loginForm.invalid) {
    //   const toast = await this.toastController.create({
    //     message: 'Kindly add credentials',
    //     duration: 2000
    //   });
    //   toast.present();
    // }
    // else {
    this.loginService.doLogin(formvalues).subscribe(async res => {
      const toast = await this.toastController.create({
        message: res.message,
        duration: 2000
      });
      if (res.isLoggedIn) {
        this.loginService.idValue(res.id);
        this.router.navigate(['home']);
        this.loginService.setLoggedIn(true);
      }
      else {
        toast.present();
      }
    });
    // }
  }

}
