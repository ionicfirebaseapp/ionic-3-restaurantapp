import { Component } from "@angular/core";
import { NavController, IonicPage, ToastController } from "ionic-angular";
import { AlertController, LoadingController } from "ionic-angular";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-cart",
  templateUrl: "cart.html"
})
export class CartPage {
  Cart: any[] = [];
  public settings: any = {};
  subTotal: any;
  GrandTotal: any;
  couponDiscount: any = 0;
  deductedPrice: number = 0;
  otherTaxes = 0.0;
  setting: AngularFireObject<any>;
  noOfItems: any;
  total: any;
  coupons: any = [];
  currency: {};

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    this.Cart = JSON.parse(localStorage.getItem("Cart"));
    //console.log("cart-"+JSON.stringify(this.Cart));
    if (this.Cart != null) {
      this.noOfItems = this.Cart.length;
      this.callFunction();
    }
    this.db
      .list("/coupons", ref => ref.orderByChild("value"))
      .valueChanges()
      .subscribe(response => {
        this.coupons = response;
      });
  }

  applyCoupon() {
    var subTotals = this.subTotal;
    this.deductedPrice = Number(
      (this.couponDiscount / 100 * subTotals).toFixed(2)
    );
    subTotals = subTotals - this.couponDiscount / 100 * subTotals;
    this.GrandTotal = Number((subTotals + this.total).toFixed(2));
  }

  deleteItem(data) {
    for (var i = 0; i <= this.Cart.length - 1; i++) {
      if (
        this.Cart[i].item.itemId == data.item.itemId &&
        this.Cart[i].item.price.pname == data.item.price.pname
      ) {
        this.Cart.splice(i, 1);
        this.callFunction();
        if (this.Cart.length == 0) {
          localStorage.removeItem("Cart");
          this.noOfItems = null;
        } else {
          localStorage.setItem("Cart", JSON.stringify(this.Cart));
          this.Cart = JSON.parse(localStorage.getItem("Cart"));
          this.noOfItems = this.noOfItems - 1;
        }
      }
    }
  }

  callFunction() {
    this.setting = this.db.object("/settings");
    let subTotal = 0;
    this.setting.valueChanges().subscribe(data => {
      this.settings = data;
      for (var i = 0; i <= this.Cart.length - 1; i++) {
        subTotal = subTotal + this.Cart[i].itemTotalPrice;
      }
      this.subTotal = Number(subTotal.toFixed(2));
      this.total = Number(
        (this.subTotal * this.settings.totalVat / 100).toFixed(2)
      );
      this.GrandTotal = Number((this.subTotal + this.total).toFixed(2));
    });
  }

  nav() {
    if (localStorage.getItem("uid") == null) {
      let alert = this.alertCtrl.create({
        title: "SORRY!",
        subTitle: "You Have to Login First!",
        buttons: [
          {
            text: "Ok",
            handler: data => {
              this.navCtrl.push("LoginPage");
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push("AddressListPage", {
        grandTotal: this.GrandTotal,
        subTotal: this.subTotal,
        couponDiscount: this.couponDiscount,
        deductedPrice: this.deductedPrice,
        totalVat: this.total
      });
    }
  }

  add(data) {
    if (data.item.itemQunatity < 20) {
      data.item.itemQunatity = data.item.itemQunatity + 1;
      for (let i = 0; i <= this.Cart.length - 1; i++) {
        let ExtotalPrice = 0;
        let totalPrice = 0;
        if (
          this.Cart[i].item.itemId == data.item.itemId &&
          this.Cart[i].item.price.pname == data.item.price.pname
        ) {
          this.Cart[i].item.itemQunatity = data.item.itemQunatity;
          for (let j = 0; j <= this.Cart[i].item.extraOptions.length - 1; j++) {
            ExtotalPrice =
              ExtotalPrice + this.Cart[i].item.extraOptions[j].value;
          }
          if (this.Cart[i].item.price.specialPrice) {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.specialPrice;
          } else {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.value;
          }
          this.Cart[i].itemTotalPrice = totalPrice * data.item.itemQunatity;
        }
      }
      localStorage.setItem("Cart", JSON.stringify(this.Cart));
      this.callFunction();
      this.applyCoupon();
    }
  }

  remove(data) {
    if (data.item.itemQunatity > 1) {
      data.item.itemQunatity = data.item.itemQunatity - 1;
      for (let i = 0; i <= this.Cart.length - 1; i++) {
        let ExtotalPrice = 0;
        let totalPrice = 0;
        if (
          this.Cart[i].item.itemId == data.item.itemId &&
          this.Cart[i].item.price.pname == data.item.price.pname
        ) {
          this.Cart[i].item.itemQunatity = data.item.itemQunatity;
          for (let j = 0; j <= this.Cart[i].item.extraOptions.length - 1; j++) {
            ExtotalPrice =
              ExtotalPrice + this.Cart[i].item.extraOptions[j].value;
          }
          if (this.Cart[i].item.price.specialPrice) {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.specialPrice;
          } else {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.value;
          }
          this.Cart[i].itemTotalPrice = totalPrice * data.item.itemQunatity;
        }
      }
      localStorage.setItem("Cart", JSON.stringify(this.Cart));
      this.callFunction();
      this.applyCoupon();
    }
  }

  isCart(): boolean {
    return localStorage.getItem("Cart") == null || this.Cart.length == 0
      ? false
      : true;
  }

  gotoHome() {
    localStorage.removeItem("Cart");
    this.navCtrl.push("HomePage");
  }
}
