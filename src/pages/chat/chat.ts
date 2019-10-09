import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Content } from "ionic-angular/index";
import { IonicPage, NavController } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  userId: any;
  messageList: Array<any>;
  messageObserable: AngularFireList<any>;
  chatMessage = {
    message: "",
    sendBy: "User",
    userName: "",
    createdAt: Date.now()
  };
  userDisplayPic: string = "assets/img/profile.jpg";
  sevenDaysBack: any;
  imageUrl: string;

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController
  ) { }

  ionViewDidLoad() {
    let date = new Date();
    let midnight = date.setUTCHours(0, 0, 0, 0);
    this.sevenDaysBack = midnight - 7 * 24 * 60 * 60 * 1000;

    if (this.af.auth.currentUser) {
      this.userId = this.af.auth.currentUser.uid;
      this.db
        .object("/users/" + this.userId)
        .valueChanges()
        .subscribe((res: any) => {
          this.chatMessage.userName = res.name;
          if (res.image) {
            this.userDisplayPic = res.image;
            this.imageUrl = res.image;
          } else {
            this.userDisplayPic = "assets/img/profile.jpg";
          }
        });
      this.messageObserable = this.db.list("/messages/" + this.userId);
      this.messageObserable.valueChanges().subscribe(res => {
        this.messageList = [];
        this.messageList = res;
        this.scrollToBottom();
      });
    } else {
      this.navCtrl.push("HomePage");
    }
  }

  sendMessage(form: NgForm) {
    this.messageObserable.push(this.chatMessage).then(res => {
      this.chatMessage.message = "";
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
}
