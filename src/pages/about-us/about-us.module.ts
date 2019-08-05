import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AboutUsPage } from "./about-us";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [AboutUsPage],
  imports: [IonicPageModule.forChild(AboutUsPage), PipesModule],
  exports: [AboutUsPage]
})
export class AboutUsPageModule {}
