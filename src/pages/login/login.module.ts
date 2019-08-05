import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LoginPage } from "./login";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage), PipesModule],
  exports: [LoginPage]
})
export class LoginPageModule {}
