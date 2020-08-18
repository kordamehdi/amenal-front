import { FicheActiviteDesignationComponent } from "./fiche-activite-designation/fiche-activite-designation.component";
import { FicheValidActiviteDesignationComponent } from "./fiche-valid-activite-designation/fiche-valid-activite-designation.component";
import { FicheActiviteComponent } from "./fiche-activite.component";
import { LotComponent } from "./lot/lot.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheActiviteComponent
  }
];
@NgModule({
  declarations: [
    LotComponent,
    FicheActiviteComponent,
    FicheValidActiviteDesignationComponent,
    FicheActiviteDesignationComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheActiviteModule {}
