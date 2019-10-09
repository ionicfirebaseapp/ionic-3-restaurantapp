import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {

  ordersDetails: any[] = [];
  public noOfItems: number;
  public currency: {};

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    if (this.af.auth.currentUser) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present().then(() => {
        let userID = this.af.auth.currentUser.uid;
        this.db
          .list("/orders", ref => ref.orderByChild("userId").equalTo(userID))
          .snapshotChanges()
          .pipe(
            map(changes =>
              changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
            )
          ).subscribe((res: any) => {
            this.ordersDetails = res;
            console.log("order Detail" + JSON.stringify(this.ordersDetails));
          })

        // .subscribe(
        //   (res: any) => {
        //     this.ordersDetails = [];
        //     res.forEach(item => {
        //       let temp = item.payload.val();
        //       temp["$key"] = item.payload.key;
        //       this.ordersDetails.push(temp);
        //       // console.log("orders-" + JSON.stringify(this.ordersDetails));
        //     });
        loader.dismiss();
      },
        error => {
          console.error(error);
          loader.dismiss();
        }
      );

    }
  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;


  }

  isOrders(): boolean {
    return this.ordersDetails.length == 0 ? false : true;
  }

  orders(orderId, key) {
    console.log(key);
    this.navCtrl.push("OrdersPage", { orderId: orderId, orderKey: key });
  }

}
