import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FavouritePage } from "./favourite";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [FavouritePage],
  imports: [IonicPageModule.forChild(FavouritePage), PipesModule],
  exports: [FavouritePage]
})
export class FavouritePageModule {}
