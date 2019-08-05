import { Component } from "@angular/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  mySlideOptions = {
    initialSlide: 1,
    loop: true,
    autoplay: 2000,
    pager: false
  };
  Cart: any = [];
  noOfItems: any;
  uid;

  public ComingData: Array<any> = [];
  public Categories: Array<any> = [];
  comingData: AngularFireList<any>;
  categories: AngularFireList<any>;

  constructor(
    public navCtrl: NavController,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController
  ) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present().then(() => {
      this.comingData = af.list("/coming");
      this.categories = af.list("/categories");
      this.comingData.valueChanges().subscribe(data => {
        this.ComingData = data;
      });
      this.categories.snapshotChanges().subscribe(data => {
        this.Categories = [];
        data.forEach(item => {
          let temp = item.payload.toJSON();
          temp["$key"] = item.payload.key;
          this.Categories.push(temp);
        });
        loader.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    this.Cart = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = this.Cart != null ? this.Cart.length : null;
    this.uid = localStorage.getItem('uid');
    if (this.uid != null) {
      if (localStorage.getItem("playerId")) {
        this.af.object("/users/" + this.uid).update({
          playerId: localStorage.getItem("playerId")
        });
      }
    }
  }

  navigate(id) {
    this.navCtrl.push("ProductListPage", { id: id });
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }
}
