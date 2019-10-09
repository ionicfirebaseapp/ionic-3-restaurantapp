import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-order-details",
  templateUrl: "order-details.html"
})
export class OrderDetailsPage {
  _orderId: any;
  index: any;
  public orderkey: any;
  orderDetails: any = {
    item: { review: "" }
  };
  public currency: {};

  constructor(
    public af: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    this._orderId = this.navParams.get("orderId");
    this.orderkey = this.navParams.get("orderKey");
    console.log(this.orderkey)
    this.index = this.navParams.get("index");
    this.af
      .object("/orders/" + this._orderId + "/cart/" + this.index)
      .valueChanges()
      .subscribe((res: any) => {
        this.orderDetails = res;
        console.log("details--" + JSON.stringify(res));
      });
  }

  buyAgain(key) {
    this.navCtrl.push("ProductDetailsPage", { id: key });
  }

  rate(itemId) {
    this.navCtrl.push("RatingPage", {
      orderId: this._orderId,
      index: this.index,
      itemId: itemId
    });
  }
}
