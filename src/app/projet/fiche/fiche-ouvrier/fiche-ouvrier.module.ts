import { SharedModule } from "src/app/shared.module";
import { FicheValideOuvrierDesignationComponent } from "./fiche-valide-ouvrier-designation/fiche-valide-ouvrier-designation.component";
import { FicheOuvrierDesignationComponent } from "./fiche-ouvrier-designation/fiche-ouvrier-designation.component";
import { NgModule } from "@angular/core";
import { FicheOuvrierComponent } from "./fiche-ouvrier.component";
import { OuvrierComponent } from "./ouvrier/ouvrier.component";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheOuvrierComponent
  }
];
@NgModule({
  declarations: [
    OuvrierComponent,
    FicheOuvrierDesignationComponent,
    FicheOuvrierComponent,
    FicheValideOuvrierDesignationComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheOuvrierModule {}
