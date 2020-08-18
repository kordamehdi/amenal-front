import { FicheActiviteService } from "./projet/fiche/fiche-activite/fiche-activite.service";
import { LotService } from "./projet/fiche/fiche-activite/lot/lot.service";
import { IsRootGuard } from "./projet/service/isRoot.guard";
import { UtilisateurService } from "./projet/utilisateur/utilisateur.service";

import { DialogComponent } from "./custum-component/dialog/dialog.component";
import { VisiteurDesignationService } from "./projet/fiche/fiche-visiteur/visiteur-designation/visiteur-designation.service";
import { FicheBesionService } from "./projet/fiche/fiche-besion/fiche-besion.service";
import { DocumentSerive } from "./projet/fiche/fiche-document/document/document.service";
import { LivraisonDesignationService } from "./projet/fiche/fiche-livraison/livraison-designation/livraison-designation.service";
import { FicheMaterielService } from "./projet/fiche/fiche-location/materiel/materie.service";
import { DesignationReceptionService } from "./projet/fiche/fiche-reception/designation-reception/designation-reception.service";
import { FournisseurArticleService } from "./projet/fiche/fiche-reception/fournisseur-article/fournisseur-article.service";
import { FicheService } from "./projet/fiche/fiche.service";
import { FicheOuvrierDesignationService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { FicheOuvrierService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier.service";
import { DataStorageService } from "./projet/service/data-storage.service";
import { reducers } from "./store/app.reducers";
import { NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";

import { RouteReuseStrategy } from "@angular/router";

import { IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { StoreModule } from "@ngrx/store";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FicheLocationService } from "./projet/fiche/fiche-location/fiche-location.service";
import { ListeArticleService } from "./projet/fiche/fiche-reception/liste-article/liste-article.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { IonicGestureConfig } from "./projet/service/ionic-gesture-config.service";
import { DestinationService } from "./projet/fiche/fiche-livraison/destination/destination.service";
import { ProjetService } from "./projet/fiche/projet-tab/projet-tab.service";
import { FicheAccidentService } from "./projet/fiche/fiche-accident/fiche-accident.service";
import { VisiteurService } from "./projet/fiche/fiche-visiteur/visiteur/visiteur.service";

import { LoginService } from "./login/login.service";
import { AuthInterceptor } from "./login/AuthInterceptor.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { IsAuthGuard } from "./projet/service/isAuth.guard";
import { CanShowFicheGuard } from "./projet/service/can-activate.guard";
import { SharedModule } from "./shared.module";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers)
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ScreenOrientation,
    FicheActiviteService,
    LotService,
    IsRootGuard,
    LoginService,
    UtilisateurService,
    VisiteurDesignationService,
    VisiteurService,
    FicheBesionService,
    FicheAccidentService,
    DocumentSerive,
    ProjetService,
    LivraisonDesignationService,
    DestinationService,
    FicheMaterielService,
    DesignationReceptionService,
    IsAuthGuard,
    CanShowFicheGuard,
    FournisseurArticleService,
    ScreenOrientation,
    ListeArticleService,
    FicheLocationService,
    FicheService,
    FicheOuvrierDesignationService,
    FicheOuvrierService,
    DataStorageService,
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    }
  ],
  exports: [DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
