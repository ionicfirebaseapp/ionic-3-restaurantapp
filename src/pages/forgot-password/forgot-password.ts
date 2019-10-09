import { CustomValidators } from 'ng2-validation';
import { Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  valForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public af: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  ) {
    this.valForm = fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ]
    });
  }

  OnSubmit($ev, value: any) {
    let loader = this.loadingCtrl.create({
      content: 'Sending Mail...',
    });
    loader.present();
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.af.auth.sendPasswordResetEmail(value.email).then(success => {
        this.showAlert('Password Reset mail has been sent to your registered mail!');
        this.navCtrl.setRoot("LoginPage");
        loader.dismiss();
      }).catch(error => {
        this.showAlert(error.message);
        loader.dismiss();
      });
    } else {
      this.showAlert('Please enter Valid email address');
      loader.dismiss();
    }
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
  }

  goToLogin() {
    this.navCtrl.setRoot("LoginPage");
  }

  Register() {
    this.navCtrl.setRoot("RegistrationPage");
  }

}
