import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AddressListPage } from "./address-list";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [AddressListPage],
  imports: [IonicPageModule.forChild(AddressListPage), PipesModule],
  exports: [AddressListPage]
})
export class AddressListPageModule {}
