import { LoadingComponent } from "./../custum-component/loading/loading.component";
import { reducers } from "./../store/app.reducers";
import { DataStorageService } from "./service/data-storage.service";
import { StoreModule } from "@ngrx/store";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IonicModule } from "@ionic/angular";

import { ProjetPageRoutingModule } from "./projet-routing.module";

import { ProjetPage } from "./projet.page";

@NgModule({
  providers: [],
  imports: [IonicModule, ProjetPageRoutingModule],
  declarations: [ProjetPage, LoadingComponent]
})
export class ProjetPageModule {}
