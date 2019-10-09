import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NgForm } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { EmailComposer } from "@ionic-native/email-composer";

@IonicPage()
@Component({
  selector: "page-contact",
  templateUrl: "contact.html",
  providers: [EmailComposer]
})
export class ContactPage {
  user: any = {};

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    public emailComposer: EmailComposer
  ) { }

  onSend(user: NgForm) {
    if (this.af.auth.currentUser) {
      this.user.userId = this.af.auth.currentUser.uid;
      this.db
        .list("/contact")
        .push(this.user)
        .then(res => {
          this.user = {};
        });
    }
    let email = {
      to: "san10694@gmail.com",
      subject: this.user.name,
      body: this.user.message,
      isHtml: true
    };
    this.emailComposer.open(email, function () { });
    this.user = "";
  }
}
