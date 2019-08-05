import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CartPage } from "./cart";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [CartPage],
  imports: [IonicPageModule.forChild(CartPage), PipesModule],
  exports: [CartPage]
})
export class CartPageModule {}
