import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProductListPage } from "./product-list";
import { PipesModule } from "../../app/pipes.module";
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [ProductListPage],
  imports: [
    IonicPageModule.forChild(ProductListPage),
    IonicPageModule,
    PipesModule,
    Ionic2RatingModule
  ],
  exports: [ProductListPage]
})
export class ProductListPageModule {}
