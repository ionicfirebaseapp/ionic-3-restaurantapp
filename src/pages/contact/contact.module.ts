import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ContactPage } from "./contact";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [ContactPage],
  imports: [IonicPageModule.forChild(ContactPage), PipesModule],
  exports: [ContactPage]
})
export class ContactPageModule {}
