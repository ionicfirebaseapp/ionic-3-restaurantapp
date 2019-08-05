import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AddAddressPage } from "./add-address";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [AddAddressPage],
  imports: [IonicPageModule.forChild(AddAddressPage), PipesModule],
  exports: [AddAddressPage]
})
export class AddAddressPageModule {}
