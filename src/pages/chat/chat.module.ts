import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ChatPage } from "./chat";
import { MomentModule } from "angular2-moment";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [ChatPage],
  imports: [IonicPageModule.forChild(ChatPage), MomentModule, PipesModule],
  exports: [ChatPage]
})
export class ChatPageModule {}
