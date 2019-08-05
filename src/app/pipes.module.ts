import { NgModule } from "@angular/core";
import { AppPipe } from "./app.pipe";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [AppPipe],
  imports: [TranslateModule],

  exports: [TranslateModule, AppPipe]
})
export class PipesModule {}
