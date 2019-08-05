import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrdersPage } from "./orders";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [OrdersPage],
  imports: [IonicPageModule.forChild(OrdersPage), PipesModule],
  exports: [OrdersPage]
})
export class OrdersPageModule {}
