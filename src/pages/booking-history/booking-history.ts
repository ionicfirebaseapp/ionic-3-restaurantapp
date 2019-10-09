import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";

import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-booking-history",
  templateUrl: "booking-history.html"
})
export class BookingHistoryPage {
  public bookingDetails: Array<{}>;
  private uid: string;
  private username: string;

  constructor(
    public navCtrl: NavController,
    private dbService: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {
    this.uid = localStorage.getItem("uid");
    this.dbService
      .object("users/" + this.uid)
      .valueChanges()
      .subscribe((user: any) => {
        console.log(user);
        if (user != null) {
          this.username = user.name;
        }

      });
    dbService
      .list("table-bookings")
      .valueChanges()
      .subscribe(
        res => {
          this.bookingDetails = [];
          res.forEach((item: any) => {
            if (item.userID == this.uid) {
              item["username"] = this.username;
              this.bookingDetails.push(item);
            }
          });
        },
        error => {
          this.presentToast(error.message);
        }
      );
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
}
