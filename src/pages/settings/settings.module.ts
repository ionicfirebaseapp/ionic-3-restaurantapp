import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { Settings } from "./settings";
import { PipesModule } from "../../app/pipes.module";
import "firebase/storage";

@NgModule({
  declarations: [Settings],
  imports: [IonicPageModule.forChild(Settings), PipesModule],
  exports: [Settings]
})
export class SettingsModule {}
