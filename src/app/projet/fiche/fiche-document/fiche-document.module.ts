import { DocumentComponent } from "./document/document.component";
import { FicheDocumentComponent } from "./fiche-document.component";
import { DocumentDesignationComponent } from "./document-designation/document-designation.component";
import { DocumentDesignationValideComponent } from "./document-designation-valide/document-designation-valide.component";
import { SharedModule } from "src/app/shared.module";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    component: FicheDocumentComponent
  }
];
@NgModule({
  declarations: [
    DocumentDesignationValideComponent,
    DocumentDesignationComponent,
    FicheDocumentComponent,
    DocumentComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule]
})
export class FicheDocumentModule {}
