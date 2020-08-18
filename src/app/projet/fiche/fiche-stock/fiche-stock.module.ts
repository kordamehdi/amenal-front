import { FicheStockComponent } from "./fiche-stock.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheStockComponent
  }
];
@NgModule({
  declarations: [FicheStockComponent],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheStockModule {}
