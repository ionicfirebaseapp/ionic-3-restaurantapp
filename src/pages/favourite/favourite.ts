import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-favourite",
  templateUrl: "favourite.html"
})
export class FavouritePage {
  favouriteItems: any[] = [];
  Cart: any[];
  noOfItems: number;

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {
    this.Cart = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = this.Cart != null ? this.Cart.length : null;
    if (this.af.auth.currentUser) {
      this.db
        .list("/users/" + this.af.auth.currentUser.uid + "/favourite/")
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
          )
        ).subscribe((res: any) => {
          this.favouriteItems = res;
        })
      // .subscribe((res: any) => {
      //   this.favouriteItems = [];
      //   res.forEach(item => {
      //     let temp = item.payload.val();
      //     temp["$key"] = item.payload.key;
      //     this.favouriteItems.push(temp);
      //   });
      // });
    }
  }

  isFavourite(): boolean {
    if (this.favouriteItems.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  buyNow(key) {
    this.navCtrl.push("ProductDetailsPage", { id: key });
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }

  removeFromFavourites(key) {
    if (this.af.auth.currentUser) {
      this.db
        .object("/users/" + this.af.auth.currentUser.uid + "/favourite/" + key)
        .remove();
      this.createToaster("removed from favourites", "3000");
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
