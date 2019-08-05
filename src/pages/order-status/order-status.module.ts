import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderStatusPage } from "./order-status";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [OrderStatusPage],
  imports: [IonicPageModule.forChild(OrderStatusPage), PipesModule],
  exports: [OrderStatusPage]
})
export class OrderStatusPageModule {}
