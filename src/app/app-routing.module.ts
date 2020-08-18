import { IsRootGuard } from "./projet/service/isRoot.guard";
import { FicheVisiteurComponent } from "./projet/fiche/fiche-visiteur/fiche-visiteur.component";
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
import { FicheActiviteComponent } from "./projet/fiche/fiche-activite/fiche-activite.component";
import { CanShowFicheGuard } from "./projet/service/can-activate.guard";

import { ProjetTabComponent } from "./projet/fiche/projet-tab/projet-tab.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UtilisateurComponent } from "./projet/utilisateur/utilisateur.component";
import { LoginComponent } from "./login/login.component";
import { IsAuthGuard } from "./projet/service/isAuth.guard";

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
    path: "fiche",
    loadChildren: "./projet/fiche/fiche.module#FicheModule"
  },

  {
    path: "",
    redirectTo: "fiche",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
