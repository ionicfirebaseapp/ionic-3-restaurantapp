
import { Component } from "@angular/core";
import { IonicPage, NavController, LoadingController,NavParams } from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: "page-orders",
  templateUrl: "orders.html"
})
export class OrdersPage {
  public ordersDetails: any[] = [];


  public noOfItems: number;
  public currency: {};
  public orderId:any;

  constructor(
    public navParams: NavParams,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {

    this.orderId = this.navParams.get("orderId");
    
    console.log("orderID", this.orderId);


    this.currency = JSON.parse(localStorage.getItem('currency'));
    if (this.af.auth.currentUser) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
         loader.present();

        this.db.object("/orders/" + this.orderId + "/cart/")
        .valueChanges()
        .subscribe((res: any) => {
          this.ordersDetails = res;
          console.log("details--" + JSON.stringify(this.ordersDetails));
          loader.dismiss();
        });
   
    }
  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;
  }

  orderDetails(index) {
    this.navCtrl.push("OrderDetailsPage", {
      index: index,
      orderId: this.orderId,
    });
  }

  orderStatus() {
    this.navCtrl.push("OrderStatusPage", {
      orderId: this.orderId,
    });
  }

  isOrders(): boolean {
    return this.ordersDetails.length == 0 ? false : true;
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }
}
