import { AccueilComponent } from "./../../accueil/accueil.component";
import { FicheOuvrierComponent } from "./fiche-ouvrier/fiche-ouvrier.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FichePage } from "./fiche.page";

const routes: Routes = [
  {
    path: "",
    component: FichePage,
    children: [
      { path: "", redirectTo: "accueil", pathMatch: "full" },
      { path: "accueil", component: AccueilComponent },
      { path: "ouvrier", component: FicheOuvrierComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichePageRoutingModule {}
