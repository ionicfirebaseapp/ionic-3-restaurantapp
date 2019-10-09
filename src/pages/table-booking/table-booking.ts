import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  AlertController,
  ToastController
} from "ionic-angular";
import { DatePicker } from "@ionic-native/date-picker";
import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-table-booking",
  templateUrl: "table-booking.html"
})
export class TableBookingPage {
  public date: any;
  public time: any;
  public person: any;
  private uid: string;
  public bookTable: {
    userID: string;
    time: string;
    date: Date;
    person: number;
    status: string;
  };

  constructor(
    public navCtrl: NavController,
    public datePicker: DatePicker,
    private dbService: AngularFireDatabase,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.uid = localStorage.getItem("uid");
  }

  onClickBookTable() {
    if (this.time && this.date && this.person != undefined) {
      this.bookTable = {
        userID: this.uid,
        status: "Pending",
        time: this.time,
        date: this.date,
        person: this.person
      };
      this.presentConfirm();
    } else {
      this.presentToast("All filed Required to book table.");
    }
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Booking",
      message: "Sure? Do you want to book table?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            this.presentToast("Not Intrested?. Going back...");
            this.navCtrl.pop();
          }
        },
        {
          text: "Book",
          handler: () => {
            this.dbService
              .list("table-bookings")
              .push(this.bookTable)
              .then(res => {
                this.presentToast("Table has been Booked succesfully!");
                this.navCtrl.pop();
              });
          }
        }
      ]
    });
    alert.present();
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
