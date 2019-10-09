import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-news",
  templateUrl: "news.html"
})
export class NewsPage {
  newsData: any[] = [];

  constructor(
    public af: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    af
      .list("/news")
      .snapshotChanges()
      .subscribe(res => {
        this.newsData = [];
        res.forEach(item => {
          let temp = item.payload.val();
          temp["$key"] = item.payload.key;
          this.newsData.push(temp);
        });
      });
  }

  newsDetail(key) {
    this.navCtrl.push("NewsDetailPage", {
      id: key
    });
  }

  isNews(): boolean {
    return this.newsData.length == 0 ? false : true;
  }
}
