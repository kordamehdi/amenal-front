import { FicheActiviteService } from "./projet/fiche/fiche-activite/fiche-activite.service";
import { FicheActiviteDesignationComponent } from "./projet/fiche/fiche-activite/fiche-activite-designation/fiche-activite-designation.component";
import { FicheValidActiviteDesignationComponent } from "./projet/fiche/fiche-activite/fiche-valid-activite-designation/fiche-valid-activite-designation.component";
import { LotService } from "./projet/fiche/fiche-activite/lot/lot.service";
import { FicheActiviteComponent } from "./projet/fiche/fiche-activite/fiche-activite.component";
import { IsRootGuard } from "./projet/service/isRoot.guard";
import { UtilisateurService } from "./projet/utilisateur/utilisateur.service";
import { UtilisateurFormComponent } from "./projet/utilisateur/utilisateur-form/utilisateur-form.component";
import { ClickOutsideModule } from "ng-click-outside";
import { AccueilComponent } from "./accueil/accueil.component";
import { FicheOuvrierComponent } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier.component";
import { TabComponent } from "./custum-component/tab/tab.component";
import { NavComponent } from "./projet/fiche/nav/nav.component";
import { HeaderComponent } from "./projet/fiche/header/header.component";
import { FicheComponent } from "./projet/fiche/fiche.component";
import { FicheOuvrierDesignationComponent } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.component";
import { LoadingComponent } from "./custum-component/loading/loading.component";
import { HasProjetDirective } from "./directives/has-projet.directive";
import { LongPress } from "./directives/long-press.directive";
import { FicheLocationComponent } from "./projet/fiche/fiche-location/fiche-location.component";
import { FournisseurComponent } from "./projet/fiche/fiche-location/fournisseur/fournisseur.component";
import { MaterielComponent } from "./projet/fiche/fiche-location/materiel/materiel.component";
import { FicheLocationDesgnationComponent } from "./projet/fiche/fiche-location/fiche-location-desgnation/fiche-location-desgnation.component";
import { FicheReceptionComponent } from "./projet/fiche/fiche-reception/fiche-reception.component";
import { ListeArticleComponent } from "./projet/fiche/fiche-reception/liste-article/liste-article.component";
import { FournisseurArticleComponent } from "./projet/fiche/fiche-reception/fournisseur-article/fournisseur-article.component";
import { DesignationReceptionComponent } from "./projet/fiche/fiche-reception/designation-reception/designation-reception.component";
import { FicheStockComponent } from "./projet/fiche/fiche-stock/fiche-stock.component";
import { LivraisonDesignationComponent } from "./projet/fiche/fiche-livraison/livraison-designation/livraison-designation.component";
import { FicheLivraisonComponent } from "./projet/fiche/fiche-livraison/fiche-livraison.component";
import { DestinationComponent } from "./projet/fiche/fiche-livraison/destination/destination.component";
import { ProjetTabComponent } from "./projet/fiche/projet-tab/projet-tab.component";
import { FicheBesionComponent } from "./projet/fiche/fiche-besion/fiche-besion.component";
import { DocumentComponent } from "./projet/fiche/fiche-document/document/document.component";
import { DocumentDesignationComponent } from "./projet/fiche/fiche-document/document-designation/document-designation.component";
import { FicheValideOuvrierDesignationComponent } from "./projet/fiche/fiche-ouvrier/fiche-valide-ouvrier-designation/fiche-valide-ouvrier-designation.component";
import { FicheValideLocationDesgnationComponent } from "./projet/fiche/fiche-location/fiche-valide-location-desgnation/fiche-valide-location-desgnation.component";
import { LivraisonDesignationValidComponent } from "./projet/fiche/fiche-livraison/livraison-designation-valid/livraison-designation-valid.component";
import { DesignationReceptionValidComponent } from "./projet/fiche/fiche-reception/designation-reception-valid/designation-reception-valid.component";
import { OuvrierComponent } from "./projet/fiche/fiche-ouvrier/ouvrier/ouvrier.component";
import { FicheAccidentComponent } from "./projet/fiche/fiche-accident/fiche-accident.component";
import { FicheVisiteurComponent } from "./projet/fiche/fiche-visiteur/fiche-visiteur.component";
import { FicheBesionDesignationComponent } from "./projet/fiche/fiche-besion/fiche-besion-designation/fiche-besion-designation.component";
import { FicheAccidentDesignationValidComponent } from "./projet/fiche/fiche-accident/fiche-accident-designation-valid/fiche-accident-designation-valid.component";
import { FicheAccidentDesignationComponent } from "./projet/fiche/fiche-accident/fiche-accident-designation/fiche-accident-designation.component";
import { FicheBosoinDesignationValidComponent } from "./projet/fiche/fiche-besion/fiche-bosoin-designation-valid/fiche-bosoin-designation-valid.component";
import { VisiteurDesignationValidComponent } from "./projet/fiche/fiche-visiteur/visiteur-designation-valid/visiteur-designation-valid.component";
import { DialogComponent } from "./custum-component/dialog/dialog.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { VisiteurDesignationService } from "./projet/fiche/fiche-visiteur/visiteur-designation/visiteur-designation.service";
import { FicheBesionService } from "./projet/fiche/fiche-besion/fiche-besion.service";
import { DocumentSerive } from "./projet/fiche/fiche-document/document/document.service";
import { LivraisonDesignationService } from "./projet/fiche/fiche-livraison/livraison-designation/livraison-designation.service";
import { FicheMaterielService } from "./projet/fiche/fiche-location/materiel/materie.service";
import { DesignationReceptionService } from "./projet/fiche/fiche-reception/designation-reception/designation-reception.service";
import { FournisseurArticleService } from "./projet/fiche/fiche-reception/fournisseur-article/fournisseur-article.service";
import { FicheService } from "./projet/fiche/fiche.service";
import { FicheOuvrierDesignationService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { CommonModule } from "@angular/common";
import { FicheOuvrierService } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier.service";
import { DataStorageService } from "./projet/service/data-storage.service";
import { reducers } from "./store/app.reducers";
import { NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";

import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
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
import { UtilisateurComponent } from "./projet/utilisateur/utilisateur.component";
import { VisiteurDesignationComponent } from "./projet/fiche/fiche-visiteur/visiteur-designation/visiteur-designation.component";
import { VisiteurComponent } from "./projet/fiche/fiche-visiteur/visiteur/visiteur.component";
import { DocumentDesignationValideComponent } from "./projet/fiche/fiche-document/document-designation-valide/document-designation-valide.component";
import { FicheDocumentComponent } from "./projet/fiche/fiche-document/fiche-document.component";
import { minToHrsPipe } from "./pipe/minToHours.pipe";
import { dateDiffPipe } from "./pipe/dateDiff.pipe";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./login/login.service";
import { AuthInterceptor } from "./login/AuthInterceptor.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { IsAuthGuard } from "./projet/service/isAuth.guard";
import { CanShowFicheGuard } from "./projet/service/can-activate.guard";
import { LotComponent } from "./projet/fiche/fiche-activite/lot/lot.component";
import { AutoSize } from "./directives/auto-size.directive";

@NgModule({
  declarations: [
    AutoSize,
    LotComponent,
    FicheActiviteComponent,
    LoginComponent,
    UtilisateurFormComponent,
    SidebarComponent,
    VisiteurDesignationValidComponent,
    FicheBosoinDesignationValidComponent,
    FicheAccidentDesignationComponent,
    FicheAccidentDesignationValidComponent,
    FicheBesionDesignationComponent,
    VisiteurDesignationComponent,
    VisiteurComponent,
    FicheVisiteurComponent,
    FicheAccidentComponent,
    OuvrierComponent,
    DesignationReceptionValidComponent,
    LivraisonDesignationValidComponent,
    FicheValideLocationDesgnationComponent,
    DocumentDesignationValideComponent,
    FicheValideOuvrierDesignationComponent,
    DocumentDesignationComponent,
    FicheDocumentComponent,
    DocumentComponent,
    FicheBesionComponent,
    ProjetTabComponent,
    minToHrsPipe,
    DestinationComponent,
    FicheLivraisonComponent,
    LivraisonDesignationComponent,
    FicheStockComponent,
    DesignationReceptionComponent,
    FournisseurArticleComponent,
    ListeArticleComponent,
    FicheReceptionComponent,
    FicheLocationDesgnationComponent,
    MaterielComponent,
    FournisseurComponent,
    FicheLocationComponent,
    LongPress,
    HasProjetDirective,
    LoadingComponent,
    dateDiffPipe,
    FicheOuvrierDesignationComponent,
    FicheComponent,
    HeaderComponent,
    NavComponent,
    TabComponent,
    FicheOuvrierComponent,
    AccueilComponent,
    DialogComponent,
    UtilisateurComponent,
    AppComponent,
    FicheValidActiviteDesignationComponent,
    FicheActiviteDesignationComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      scrollPadding: false
    }),
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    HttpClientModule,
    BrowserAnimationsModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
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
