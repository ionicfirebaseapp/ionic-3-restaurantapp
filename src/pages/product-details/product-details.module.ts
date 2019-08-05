import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProductDetailsPage } from "./product-details";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [ProductDetailsPage],
  imports: [IonicPageModule.forChild(ProductDetailsPage), PipesModule],
  exports: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
