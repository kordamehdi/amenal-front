import { LivraisonDesignationComponent } from "./livraison-designation/livraison-designation.component";
import { DestinationComponent } from "./destination/destination.component";
import { LivraisonDesignationValidComponent } from "./livraison-designation-valid/livraison-designation-valid.component";
import { FicheLivraisonComponent } from "./fiche-livraison.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheLivraisonComponent
  }
];
@NgModule({
  declarations: [
    LivraisonDesignationValidComponent,
    DestinationComponent,
    FicheLivraisonComponent,
    LivraisonDesignationComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheLivraisonModule {}
