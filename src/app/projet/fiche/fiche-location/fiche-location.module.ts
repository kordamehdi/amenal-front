import { FicheValideLocationDesgnationComponent } from "./fiche-valide-location-desgnation/fiche-valide-location-desgnation.component";
import { FicheLocationComponent } from "./fiche-location.component";
import { FournisseurComponent } from "./fournisseur/fournisseur.component";
import { MaterielComponent } from "./materiel/materiel.component";
import { FicheLocationDesgnationComponent } from "./fiche-location-desgnation/fiche-location-desgnation.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheLocationComponent
  }
];
@NgModule({
  declarations: [
    FicheLocationDesgnationComponent,
    MaterielComponent,
    FournisseurComponent,
    FicheLocationComponent,
    FicheValideLocationDesgnationComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheLocationModule {}
