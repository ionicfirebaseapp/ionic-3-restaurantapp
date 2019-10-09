import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { CartService } from "../../pages/cart.service";

@IonicPage()
@Component({
  selector: "page-product-details",
  templateUrl: "product-details.html"
})
export class ProductDetailsPage {
  FireVisible = false;
  id: any;
  count: any = 1;
  isLiked: boolean = false;
  public menuItems: any = {};
  public cart = {
    itemId: String,
    extraOptions: [],
    price: {
      name: "",
      value: 0,
      currency: ""
    },
    title: "",
    thumb: String,
    itemQunatity: this.count
  };
  noOfItems: any;
  public selectedItems: Array<any> = [];
  menuItem: AngularFireObject<any>;
  currency: {};

  constructor(
    public navCtrl: NavController,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navParams: NavParams,
    public cartService: CartService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    this.id = this.navParams.get("id");
    this.menuItem = db.object("/menuItems/" + this.id);
    this.menuItem.valueChanges().subscribe((data: any) => {
      if (data != null) {
        this.menuItems = data;
        this.menuItems["$key"] = this.id;
        this.cart.title = data.title;
        this.cart.itemId = this.id;
        this.cart.thumb = data.thumb;
      }
      if (this.af.auth.currentUser) {
        this.db
          .object(
            "/users/" + this.af.auth.currentUser.uid + "/favourite/" + this.id
          )
          .valueChanges()
          .subscribe((res: any) => {
            console.log("fav response--", res);
            if (res != null) {
              this.isLiked = true;
            } else {
              this.isLiked = false;
            }
          });
      }
    });
  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;
  }

  addQuantity() {
    if (this.count < 10) {
      this.count = this.count + 1;
      this.cart.itemQunatity = this.count;
    }
  }

  removeQuantity() {
    if (this.count > 1) {
      this.count = this.count - 1;
      this.cart.itemQunatity = this.count;
    }
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }

  home() {
    this.navCtrl.push("HomePage");
  }

  sizeOptions(price) {
    this.cart.price = price;
    this.cart.price.value = Number(price.value);
  }

  checkOptions(extraOption) {
    if (this.cart.extraOptions.length != 0) {
      for (var i = 0; i <= this.cart.extraOptions.length - 1; i++) {
        if (this.cart.extraOptions[i].name == extraOption.name) {
          this.cart.extraOptions.splice(i, 1);
          break;
        } else {
          this.cart.extraOptions.push(extraOption);
          break;
        }
      }
    } else {
      this.cart.extraOptions.push(extraOption);
    }
  }

  addToCart() {
    if (this.cart.price.name == "") {
      let alert = this.alertCtrl.create({
        title: "Please!",
        subTitle: "Select Size and Price!",
        buttons: ["OK"]
      });
      alert.present();
    } else {
      this.cartService.OnsaveLS(this.cart);
      this.navCtrl.push("CartPage");
    }
  }

  visible = false;

  addToFevrt(key) {
    if (this.af.auth.currentUser) {
      this.db
        .object("/users/" + this.af.auth.currentUser.uid + "/favourite/" + key)
        .update({
          thumb: this.menuItems.thumb,
          title: this.menuItems.title,
          description: this.menuItems.description
        })
        .then(res => {
          this.isLiked = true;
          this.createToaster("added to favourites", "3000");
        });
    } else {
      this.createToaster("please login first", "3000");
    }
  }

  removeFevrt(key) {
    if (this.af.auth.currentUser) {
      this.db
        .object("/users/" + this.af.auth.currentUser.uid + "/favourite/" + key)
        .remove()
        .then(() => {
          this.isLiked = false;
          this.createToaster("removed from favourites", "3000");
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
