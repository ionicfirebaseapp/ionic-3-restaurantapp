import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-rating",
  templateUrl: "rating.html"
})
export class RatingPage {
  review: any = {
    rating: "",
    comment: ""
  };
  itemId: "";
  index: "";
  orderId: "";
  reviews: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {
    this.itemId = this.navParams.get("itemId");
    this.index = this.navParams.get("index");
    this.orderId = this.navParams.get("orderId");

    this.db
      .list("/menuItems/" + this.itemId + "/reviews")
      .valueChanges()
      .subscribe((res: any) => {
        this.reviews = res;
      });
  }

  onSubmit() {
    if (this.af.auth.currentUser) {
      this.review.userId = this.af.auth.currentUser.uid;
      if (this.reviews.length == 0) {
        this.db
          .object("/menuItems/" + this.itemId + "/reviews/" + 0)
          .update({
            rating: this.review.rating,
            comment: this.review.comment,
            userId: this.review.userId
          })
          .then(response => { });
      } else {
        this.db
          .object(
            "/menuItems/" + this.itemId + "/reviews/" + this.reviews.length
          )
          .update({
            rating: this.review.rating,
            comment: this.review.comment,
            userId: this.review.userId
          })
          .then(response => {
            //console.log("update"+JSON.stringify(response));
          });
      }

      this.db
        .object(
          "/orders/" +
          this.orderId +
          "/cart/" +
          this.index +
          "/item/" +
          "/review"
        )
        .update(this.review)
        .then(success => {
          this.createToaster("Review submitted successfully", "3000");
          this.review = {};
          // this.navCtrl.push("OrderDetailsPage",{
          //   orderId: this.orderId,
          //   index: this.index
          // })
          this.navCtrl.pop();
        });
    }
  }

  createToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
}
