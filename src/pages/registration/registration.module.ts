import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RegistrationPage } from "./registration";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [RegistrationPage],
  imports: [IonicPageModule.forChild(RegistrationPage), PipesModule],
  exports: [RegistrationPage]
})
export class RegistrationPageModule {}
