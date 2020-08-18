import { FicheComponent } from "./fiche.component";
import { NgModule } from "@angular/core";
import { FicheActiviteComponent } from "./fiche-activite/fiche-activite.component";
import { FicheVisiteurComponent } from "./fiche-visiteur/fiche-visiteur.component";
import { FicheAccidentComponent } from "./fiche-accident/fiche-accident.component";
import { FicheDocumentComponent } from "./fiche-document/fiche-document.component";
import { FicheLivraisonComponent } from "./fiche-livraison/fiche-livraison.component";
import { AccueilComponent } from "src/app/accueil/accueil.component";
import { FicheOuvrierComponent } from "./fiche-ouvrier/fiche-ouvrier.component";
import { FicheLocationComponent } from "./fiche-location/fiche-location.component";
import { FicheReceptionComponent } from "./fiche-reception/fiche-reception.component";
import { FicheStockComponent } from "./fiche-stock/fiche-stock.component";
import { RouterModule, Routes } from "@angular/router";
import { LotComponent } from "./fiche-activite/lot/lot.component";
import { VisiteurDesignationValidComponent } from "./fiche-visiteur/visiteur-designation-valid/visiteur-designation-valid.component";
import { FicheBosoinDesignationValidComponent } from "./fiche-besion/fiche-bosoin-designation-valid/fiche-bosoin-designation-valid.component";
import { FicheAccidentDesignationComponent } from "./fiche-accident/fiche-accident-designation/fiche-accident-designation.component";
import { FicheAccidentDesignationValidComponent } from "./fiche-accident/fiche-accident-designation-valid/fiche-accident-designation-valid.component";
import { VisiteurDesignationComponent } from "./fiche-visiteur/visiteur-designation/visiteur-designation.component";
import { VisiteurComponent } from "./fiche-visiteur/visiteur/visiteur.component";
import { OuvrierComponent } from "./fiche-ouvrier/ouvrier/ouvrier.component";
import { DesignationReceptionValidComponent } from "./fiche-reception/designation-reception-valid/designation-reception-valid.component";
import { LivraisonDesignationValidComponent } from "./fiche-livraison/livraison-designation-valid/livraison-designation-valid.component";
import { FicheValideLocationDesgnationComponent } from "./fiche-location/fiche-valide-location-desgnation/fiche-valide-location-desgnation.component";
import { DocumentDesignationValideComponent } from "./fiche-document/document-designation-valide/document-designation-valide.component";
import { FicheValideOuvrierDesignationComponent } from "./fiche-ouvrier/fiche-valide-ouvrier-designation/fiche-valide-ouvrier-designation.component";
import { DocumentDesignationComponent } from "./fiche-document/document-designation/document-designation.component";
import { DocumentComponent } from "./fiche-document/document/document.component";
import { ProjetTabComponent } from "./projet-tab/projet-tab.component";
import { DestinationComponent } from "./fiche-livraison/destination/destination.component";
import { LivraisonDesignationComponent } from "./fiche-livraison/livraison-designation/livraison-designation.component";
import { DesignationReceptionComponent } from "./fiche-reception/designation-reception/designation-reception.component";
import { FournisseurArticleComponent } from "./fiche-reception/fournisseur-article/fournisseur-article.component";
import { ListeArticleComponent } from "./fiche-reception/liste-article/liste-article.component";
import { FicheLocationDesgnationComponent } from "./fiche-location/fiche-location-desgnation/fiche-location-desgnation.component";
import { MaterielComponent } from "./fiche-location/materiel/materiel.component";
import { FournisseurComponent } from "./fiche-location/fournisseur/fournisseur.component";
import { FicheOuvrierDesignationComponent } from "./fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.component";
import { FicheValidActiviteDesignationComponent } from "./fiche-activite/fiche-valid-activite-designation/fiche-valid-activite-designation.component";
import { FicheActiviteDesignationComponent } from "./fiche-activite/fiche-activite-designation/fiche-activite-designation.component";
import { SharedModule } from "src/app/shared.module";
import { HeaderComponent } from "./header/header.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IsAuthGuard } from "../service/isAuth.guard";
import { CanShowFicheGuard } from "../service/can-activate.guard";

export const routes: Routes = [
  {
    path: "",
    component: FicheComponent,
    children: [
      {
        path: "accueil",
        component: AccueilComponent
      },
      {
        path: "ouvrier",
        loadChildren: "./fiche-ouvrier/fiche-ouvrier.module#FicheOuvrierModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "location",
        loadChildren:
          "./fiche-location/fiche-location.module#FicheLocationModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "reception",
        loadChildren:
          "./fiche-reception/fiche-reception.module#FicheReceptionModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "stock",
        loadChildren: "./fiche-stock/fiche-stock.module#FicheStockModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "besoin",
        loadChildren: "./fiche-besion/fiche-besion.module#FicheBesionModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "livraison",
        loadChildren:
          "./fiche-livraison/fiche-livraison.module#FicheLivraisonModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "document",
        loadChildren:
          "./fiche-document/fiche-document.module#FicheDocumentModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "accident",
        loadChildren:
          "./fiche-accident/fiche-accident.module#FicheAccidentModule",
        canActivate: [IsAuthGuard]
      },

      {
        path: "visiteur",
        loadChildren:
          "./fiche-visiteur/fiche-visiteur.module#FicheVisiteurModule",
        canActivate: [IsAuthGuard]
      },
      {
        path: "activite",
        loadChildren:
          "./fiche-activite/fiche-activite.module#FicheActiviteModule",
        canActivate: [IsAuthGuard]
      },
      { path: "", redirectTo: "fiche", pathMatch: "full" }
    ]
  }
];
@NgModule({
  declarations: [AccueilComponent, FicheComponent],

  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheModule {}
