import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  Platform,
  AlertController,
  Events
} from "ionic-angular";
import { CustomValidators } from "ng2-validation";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { Facebook } from "@ionic-native/facebook";
import * as firebase from "firebase";
import { GooglePlus } from "@ionic-native/google-plus";
import { TwitterConnect } from "@ionic-native/twitter-connect";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
  providers: [Facebook, GooglePlus, TwitterConnect]
})
export class LoginPage {
  tagHide: boolean = true;
  valForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public facebook: Facebook,
    public googlePlus: GooglePlus,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public twitter: TwitterConnect,
    public platform: Platform,
    public events: Events
  ) {
    this.valForm = fb.group({
      email: [
        "ionicfirebaseapp@gmail.com",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: ["123456", Validators.required]
    });
  }

  toggleRegister() {
    this.tagHide = this.tagHide ? false : true;
  }

  OnLogin($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.af.auth.signInWithEmailAndPassword(value.email, value.password).then((success: any) => {
        localStorage.setItem("uid", success.uid);
        this.publishEvent();
        this.navCtrl.setRoot("HomePage");
      }).catch(error => {
        this.showAlert(error.message);
      });
    }
  }

  private publishEvent() {
    this.db.object("/users/" + this.af.auth.currentUser.uid).valueChanges().subscribe((userInfo: any) => {
      this.events.publish("imageUrl", userInfo);
    });
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
  }

  doFbLogin() {
    let permissions = new Array();
    permissions = ["public_profile", "email", "user_education_history"];
    this.facebook.login(permissions).then(success => {
      // console.log("facebook Success response1->", success);
      this.facebook.api("/me?fields=id,name,email,gender,first_name,last_name", permissions)
        .then((user: any) => {
          var provider = firebase.auth.FacebookAuthProvider.credential(
            success.authResponse.accessToken
          );
          firebase.auth().signInWithCredential(provider).then((response: any) => {
            // console.log("facebook Success response2->", response);
            this.db.object("/users/" + response.uid).update({
              name: response.displayName,
              email: response.email,
              image: response.photoURL,
              role: "User"
            }).then(suc => {
              // console.log("facebook update response3->", suc);
              this.publishEvent();
            });
            localStorage.setItem("uid", response.uid);
            this.navCtrl.setRoot("HomePage");
          }).catch(error => {
            // console.log("fb Error1" + JSON.stringify(error));
            this.showAlert(error.message);
          });
        }),
        error => {
          // console.log("fb Error2", error);
        };
    },
      error => {
        // console.log("FaceBook ERROR3 : ", error);
      });
  }

  googleLogin() {
    this.googlePlus.login({
      scopes: "",
      webClientId: "314198464457-ehdkf0jd931nbfb3ftfs6rpkkcbat6mu.apps.googleusercontent.com",
      offline: true
    }).then(success => {
      // console.log("google response1", success);
      let loading = this.loadingCtrl.create({
        content: "Login Please Wait..."
      });
      loading.present();
      var provider = firebase.auth.GoogleAuthProvider.credential(success.idToken);
      firebase.auth().signInWithCredential(provider).then((response: any) => {
        // console.log("google response2", response);
        this.db.object("/users/" + response.uid).update({
          name: response.displayName,
          email: response.email,
          image: response.photoURL,
          role: "User"
        }).then(suc => {
          // console.log("google response3", suc);
          this.publishEvent();
        });
        localStorage.setItem("uid", response.uid);
        loading.dismiss();
        this.navCtrl.setRoot("HomePage");
      }).catch(error => {
        // console.log("gp Error1", error);
        this.showAlert(error.message);
      });
    },
      error => {
        // console.log("gp Error2", error);
      });
  }

  twitterLogin() {
    this.platform.ready().then(res => {
      if (res == "cordova") {
        this.twitter.login().then(result => {
          // console.log('twtter response1', result)
          this.twitter.showUser().then(user => {
            let loading = this.loadingCtrl.create({
              content: "Login Please Wait..."
            });
            loading.present();
            var provider = firebase.auth.TwitterAuthProvider.credential(result.token, result.secret);
            firebase.auth().signInWithCredential(provider).then((response: any) => {
              // console.log('twtter response2', response)
              this.db.object("/users/" + response.uid).update({
                name: response.displayName,
                email: response.email,
                image: response.photoURL,
                role: "User"
              }).then(suc => {
                // console.log('twtter response3', suc)
                this.publishEvent();
              });
              localStorage.setItem("uid", response.uid);
              loading.dismiss();
              this.navCtrl.setRoot("HomePage");
            }).catch(error => {
              // console.log("Error1 ", error);
              this.showAlert(error.message);
            });
          },
            onError => {
              // console.log("error2", onError);
            });
        });
      }
    });
  }

  Register() {
    this.navCtrl.setRoot("RegistrationPage");
  }

  onClickForgotPassword() {
    this.navCtrl.setRoot("ForgotPasswordPage");
  }
}
