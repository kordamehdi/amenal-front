import { FicheService } from "./projet/fiche/fiche.service";
import { FicheOuvrierDesignationService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { CommonModule } from "@angular/common";
import { FicheOuvrierService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier.service";
import { DataStorageService } from "./projet/service/data-storage.service";
import { reducers } from "./store/app.reducers";
import { ProjetEffects } from "./projet/redux/projet.effects";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule } from "@angular/common/http";
import { LongPress } from "./directives/long-press.directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ProjetEffects]),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    FicheService,
    FicheOuvrierDesignationService,
    FicheOuvrierService,
    DataStorageService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
