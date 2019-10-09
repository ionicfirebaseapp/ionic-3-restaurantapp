import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { NgForm } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-add-address",
  templateUrl: "add-address.html"
})
export class AddAddressPage {
  address: any = {};

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  addAddress(form: NgForm) {
    if (this.af.auth.currentUser) {
      this.db
        .list("/users/" + this.af.auth.currentUser.uid + "/address")
        .push(this.address)
        .then(res => {
          var id = this.navParams.get("id");
          if (id == 1) {
            this.navCtrl.push("UserAddressListPage");
          } else {
            this.navCtrl.pop();
          }
        });
    }
  }
}
