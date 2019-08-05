import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NewsDetailPage } from "./news-detail";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [NewsDetailPage],
  imports: [IonicPageModule.forChild(NewsDetailPage), PipesModule],
  exports: [NewsDetailPage]
})
export class NewsDetailPageModule {}
