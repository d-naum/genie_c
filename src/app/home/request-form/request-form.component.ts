import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoginService } from 'src/app/login/shared/login.service';
import { HomeService } from '../shared/home.service';
import { ToastController } from '@ionic/angular';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { } from 'googlemaps';
import { Plugins, Capacitor } from '@capacitor/core';
const { Geolocation } = Plugins;


@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent implements OnInit {
  map: google.maps.Map;
  // geoCoder: google.maps.Geocoder;
  options: any;
  categoryVal: any;
  user_id: any;
  requestForm: FormGroup;
  date: string = new Date().toISOString().substring(0, 10);
  finalDate: string = new Date("2030-01-31T02:00:00Z").toISOString().substring(0, 10);
  private myObject: any;
  coordinate: any;
  lat: any;
  lng: any;


  constructor(
    private router: Router,
    private homeService: HomeService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    // private geoLocation: Geolocation
    ) {
  }


  ngOnInit() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    Geolocation.getCurrentPosition().then(resp => {
      const lat = resp.coords.latitude;
      const lng = resp.coords.longitude;
      const geocoder = new google.maps.Geocoder();
      const location = new google.maps.LatLng(lat, lng);
      const myLocation = {
        lat: 31.418482,
        lng: 73.079084
      };

      const mapOptions = {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      geocoder.geocode({
        location: myLocation
      }, ( results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK') {
          console.log(results);
          if (results[0]) {
            this.homeService.address(results[0].formatted_address);
            this.homeService.currentaddress$.subscribe(res =>{
              this.requestForm.patchValue({
                address: res
              });
            });
          }
        }
      });
      const coverArea = .030000;
      const rectangle = new google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        bounds: {
          north: lat - coverArea,
          south: lat + coverArea,
          east: lng + coverArea,
          west: lng - coverArea,
        },
      });

        });

    // const options = { timeout: 10000, enableHighAccuracy: true };
    // this.geoLocation.getCurrentPosition(options).then(resp => {
    //   const lat = resp.coords.latitude;
    //   const lng = resp.coords.longitude;
    //   const geocoder = new google.maps.Geocoder();
    //   const location = new google.maps.LatLng(lat, lng);
    //   const myLocation = {
    //     lat: lat,
    //     lng: lng
    //   };

    //   const mapOptions = {
    //     center: location,
    //     zoom: 15,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     disableDefaultUI: true
    //   }
    //   this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //   geocoder.geocode({
    //     location: myLocation
    //   }, ( results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
    //     if (status === 'OK') {
    //       console.log(results);
    //       if (results[0]) {
    //         this.homeService.address(results[0].formatted_address);
    //         this.homeService.currentaddress$.subscribe(res =>{
    //           this.requestForm.patchValue({
    //             address: res
    //           });
    //         });
    //       }
    //     }
    //   });
    //   const coverArea = .008000;
    //   const rectangle = new google.maps.Rectangle({
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    //     map: this.map,
    //     bounds: {
    //       north: lat - coverArea,
    //       south: lat + coverArea,
    //       east: lng + coverArea,
    //       west: lng - coverArea,
    //     },
    //   });

    // });

    this.loginService.currentId$.subscribe(val => this.user_id = val);
    this.requestForm = this.fb.group({
      id: [],
      user_id: [this.user_id],
      worker_id: [],
      status: [0],
      service_id: [],
      sub_service_id: [],
      instructions: [''],
      payment_status: ['unpaid'],
      issue_id: [],
      priority: [''],
      date: [''],
      time: [''],
      units: [1],
      address: [''],
      address_type: [''],
      photo: [''],
      promoCode: ['']
    });
    this.homeService.currentSubCategory$.pipe(first()).subscribe(val => {
      console.log(val);
      this.requestForm.patchValue({
        sub_service_id: val
      });
    });
    this.homeService.currentCategory$.pipe(first()).subscribe(val => {
      console.log(val);
      this.requestForm.patchValue({
        service_id: val
      });
    });
  }
  createWork(formValues: Request) {
    const myLat = this.map.getCenter().lat();
    const myLng = this.map.getCenter().lng();
    const myCoverArea = .008000;
    this.homeService.sendRequest(formValues).subscribe(async res => {
      // res.transactionId
      if (res.transactionId) {
        this.myObject = {
          id: res.transactionId,
          n: myLat - myCoverArea,
          s: myLat + myCoverArea,
          e: myLng + myCoverArea,
          w: myLng - myCoverArea
        };
        console.log(this.myObject);
        this.homeService.searchWorkers(this.myObject).subscribe(async otherResult => {
          const otherToast = await this.toastController.create({
            header: otherResult.title,
            message: otherResult.message,
            duration: 5000
          });
          otherToast.present();
        });
      }

      const toast = await this.toastController.create({
        header: res.title,
        message: res.message,
        duration: 2000
      });
      toast.present();
      console.log(res.message);
    });
    this.requestForm.reset();
    this.router.navigate(['requests']);

  }
  navigateSub() {
    this.router.navigate(['home']);
  }
  navigateBack() {
    this.router.navigate(['home/subservice/' + this.activatedRoute.snapshot.params['id']]);
  }
  timeValue(v1, v2) {
    const time1 = v1.match(/\d\d:\d\d/);
    const time2 = v2.match(/\d\d:\d\d/);
    this.requestForm.patchValue({
      time: time1 + '-' + time2
    });
  }
}
