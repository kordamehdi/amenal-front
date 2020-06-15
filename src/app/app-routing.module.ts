import { IsRootGuard } from "./projet/service/isRoot.guard";
import { FicheVisiteurComponent } from "./projet/fiche/fiche-visiteur/fiche-visiteur.component";
import { ProjetTabComponent } from "./projet/fiche/projet-tab/projet-tab.component";
import { FicheAccidentComponent } from "./projet/fiche/fiche-accident/fiche-accident.component";
import { FicheDocumentComponent } from "./projet/fiche/fiche-document/fiche-document.component";
import { FicheLivraisonComponent } from "./projet/fiche/fiche-livraison/fiche-livraison.component";
import { FicheBesionComponent } from "./projet/fiche/fiche-besion/fiche-besion.component";
import { FicheStockComponent } from "./projet/fiche/fiche-stock/fiche-stock.component";
import { FicheReceptionComponent } from "./projet/fiche/fiche-reception/fiche-reception.component";
import { FicheLocationComponent } from "./projet/fiche/fiche-location/fiche-location.component";
import { FicheOuvrierComponent } from "./projet/fiche/fiche-ouvrier/fiche-ouvrier.component";
import { AccueilComponent } from "./accueil/accueil.component";
import { FicheComponent } from "./projet/fiche/fiche.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UtilisateurComponent } from "./projet/utilisateur/utilisateur.component";
import { LoginComponent } from "./login/login.component";
import { IsAuthGuard } from "./projet/service/isAuth.guard";
import { CanShowFicheGuard } from "./projet/service/can-activate.guard";
import { FicheActiviteComponent } from "./projet/fiche/fiche-activite/fiche-activite.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "utilisateur",
    component: UtilisateurComponent,
    canActivate: [IsAuthGuard, IsRootGuard]
  },
  {
    path: "projet",
    component: ProjetTabComponent,
    canActivate: [IsAuthGuard, IsRootGuard]
  },
  {
    path: "",
    redirectTo: "fiche",
    pathMatch: "full"
  },
  {
    path: "fiche",
    component: FicheComponent,
    canActivate: [IsAuthGuard],
    children: [
      {
        path: "accueil",
        component: AccueilComponent
      },
      {
        path: "ouvrier",
        component: FicheOuvrierComponent
      },
      {
        path: "location",
        component: FicheLocationComponent
      },
      {
        path: "reception",
        component: FicheReceptionComponent
      },
      {
        path: "stock",
        component: FicheStockComponent
      },
      {
        path: "besoin",
        component: FicheBesionComponent
      },
      {
        path: "livraison",
        component: FicheLivraisonComponent
      },
      {
        path: "document",
        component: FicheDocumentComponent
      },
      {
        path: "accident",
        component: FicheAccidentComponent
      },

      {
        path: "visiteur",
        component: FicheVisiteurComponent
      },
      {
        path: "activite",
        component: FicheActiviteComponent
      },
      { path: "", redirectTo: "accueil", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
