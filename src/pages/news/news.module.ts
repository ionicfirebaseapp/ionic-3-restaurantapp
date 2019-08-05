import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NewsPage } from "./news";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [NewsPage],
  imports: [IonicPageModule.forChild(NewsPage), PipesModule],
  exports: [NewsPage]
})
export class NewsPageModule {}
