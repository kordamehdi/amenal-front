import { DesignationReceptionComponent } from "./designation-reception/designation-reception.component";
import { FournisseurArticleComponent } from "./fournisseur-article/fournisseur-article.component";
import { ListeArticleComponent } from "./liste-article/liste-article.component";
import { FicheReceptionComponent } from "./fiche-reception.component";
import { DesignationReceptionValidComponent } from "./designation-reception-valid/designation-reception-valid.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheReceptionComponent
  }
];
@NgModule({
  declarations: [
    DesignationReceptionComponent,
    FournisseurArticleComponent,
    ListeArticleComponent,
    FicheReceptionComponent,
    DesignationReceptionValidComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheReceptionModule {}
