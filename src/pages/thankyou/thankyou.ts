import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-thankyou",
  templateUrl: "thankyou.html"
})
export class ThankyouPage {
  constructor(public navCtrl: NavController) {
    localStorage.removeItem("Cart");
  }

  home() {
    this.navCtrl.push("HomePage");
  }
}
