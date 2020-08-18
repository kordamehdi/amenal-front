import { FicheAccidentDesignationValidComponent } from "./fiche-accident-designation-valid/fiche-accident-designation-valid.component";
import { FicheAccidentDesignationComponent } from "./fiche-accident-designation/fiche-accident-designation.component";
import { FicheAccidentComponent } from "./fiche-accident.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheAccidentComponent
  }
];
@NgModule({
  declarations: [
    FicheAccidentDesignationComponent,
    FicheAccidentDesignationValidComponent,
    FicheAccidentComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheAccidentModule {}
