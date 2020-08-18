import { FicheBosoinDesignationValidComponent } from "./fiche-bosoin-designation-valid/fiche-bosoin-designation-valid.component";
import { FicheBesionDesignationComponent } from "./fiche-besion-designation/fiche-besion-designation.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FicheBesionComponent } from "./fiche-besion.component";

export const routes: Routes = [
  {
    path: "",
    component: FicheBesionComponent
  }
];
@NgModule({
  declarations: [
    FicheBesionDesignationComponent,
    FicheBesionComponent,
    FicheBosoinDesignationValidComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheBesionModule {}
