import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LocationPage } from "./location";
import { AgmCoreModule } from "@agm/core";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [LocationPage],
  imports: [
    IonicPageModule.forChild(LocationPage),
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyC9QKBcDPx-r1y23IHE-Wf3ZjNZZJ1I6H4"
    })
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyDkIzaOmzxf0hm5Qd9h7YeEMtD5Iz_hpbY'
    // })
  ],
  exports: [LocationPage]
})
export class LocationPageModule {}
