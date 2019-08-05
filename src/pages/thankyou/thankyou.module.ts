import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ThankyouPage } from "./thankyou";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [ThankyouPage],
  imports: [IonicPageModule.forChild(ThankyouPage), PipesModule],
  exports: [ThankyouPage]
})
export class ThankyouPageModule {}
