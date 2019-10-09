import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, Slides } from "ionic-angular";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-offer",
  templateUrl: "offer.html"
})
export class OfferPage {
  @ViewChild(Slides) slides: Slides;
  offerData: Array<any>;
  public currency: {};

  constructor(public af: AngularFireDatabase, public navCtrl: NavController) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    this.af.list("/menuItems", ref => ref.orderByChild("offer").equalTo(true))
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe((res: any) => {
        this.offerData = res;
      })
    // .subscribe((queriedItems: any) => {
    //   this.offerData = [];
    //   queriedItems.forEach(item => {
    //     let temp = item.payload.toJSON();
    //     temp["$key"] = item.payload.key;
    //     this.offerData.push(temp);
    //   });
    // });
  }

  gotoNextSlide() {
    this.slides.slideNext();
  }

  gotoPrevSlide() {
    this.slides.slidePrev();
  }

  addToCart(key) {
    this.navCtrl.push("ProductDetailsPage", { id: key });
  }
}
