import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-order-status",
  templateUrl: "order-status.html"
})
export class OrderStatusPage {
  orderId: any;
  orderStatus: any = [];

  constructor(
    public af: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.orderId = this.navParams.get("orderId");
    this.af
      .list("/orders/" + this.orderId + "/statusReading/")
      .valueChanges()
      .subscribe((res: any) => {
        this.orderStatus = res;
        console.log("status---" + JSON.stringify(res));
      });
  }
}
