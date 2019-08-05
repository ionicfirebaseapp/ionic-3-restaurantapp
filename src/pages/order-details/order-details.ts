import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: "page-order-details",
  templateUrl: "order-details.html"
})
export class OrderDetailsPage {
  orderId: any;
  index: any;
  
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
    this.orderId = this.navParams.get("orderId");
    this.index = this.navParams.get("index");
    this.af
      .object("/orders/" + this.orderId + "/cart/" + this.index)
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
      orderId: this.orderId,
      index: this.index,
      itemId: itemId
    });
  }
}
