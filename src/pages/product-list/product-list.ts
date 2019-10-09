import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-product-list",
  templateUrl: "product-list.html"
})
export class ProductListPage {
  id: any;
  public menuItems: Array<any> = [];
  public selectedItems: Array<any> = [];
  menuItem: AngularFireList<any>;
  noOfItems: any;
  items: any = [];
  currency: {};

  constructor(
    public navCtrl: NavController,
    public af: AngularFireDatabase,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present().then(() => {
      this.id = this.navParams.get("id");
      if (this.id == undefined) {
        this.navCtrl.push("HomePage");
      }
      this.menuItem = af.list("/menuItems");

      let subscription = this.menuItem
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
          )
        ).subscribe((res: any) => {
          this.menuItems = res;
          console.log(res)
          for (var i = 0; i <= this.menuItems.length - 1; i++) {
            if (this.menuItems[i].category == this.id) {
              this.selectedItems.push(this.menuItems[i]);
              this.items = this.selectedItems;
              for (var j = 0; j < this.items.length; j++) {
                var sum = 0;
                if (this.items[j].reviews) {
                  for (var k = 0; k < this.items[j].reviews.length; k++) {
                    sum = sum + this.items[j].reviews[k].rating;
                  }
                  let avg = sum / this.items[j].reviews.length;
                  this.items[j].reviewData = avg;
                }
              }
            }
          }
          // subscription.unsubscribe();
        })
      // .subscribe((data: any) => {
      //   this.menuItems = [];
      //   data.forEach(item => {
      //     let temp = item.payload.val();
      //     temp["$key"] = item.payload.key;
      //     this.menuItems.push(temp);
      //     subscription.unsubscribe();
      //   });
      loader.dismiss();
      //this.items = [];

    });

  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;
  }

  initializeItems() {
    this.items = this.selectedItems;
  }

  getItems(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    if (val && val.trim() != "") {
      this.items = this.items.filter(data => {
        return data.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  navigate(item) {
    this.navCtrl.push("ProductDetailsPage", { id: item });
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }
}
