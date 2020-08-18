import { VisiteurDesignationValidComponent } from "./visiteur-designation-valid/visiteur-designation-valid.component";
import { VisiteurDesignationComponent } from "./visiteur-designation/visiteur-designation.component";
import { VisiteurComponent } from "./visiteur/visiteur.component";
import { FicheVisiteurComponent } from "./fiche-visiteur.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheVisiteurComponent
  }
];
@NgModule({
  declarations: [
    VisiteurDesignationValidComponent,
    VisiteurDesignationComponent,
    VisiteurComponent,
    FicheVisiteurComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheVisiteurModule {}
