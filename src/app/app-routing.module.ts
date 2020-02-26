import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "fiche",
    pathMatch: "full"
  },
  {
    path: "fiche",
    loadChildren: () =>
      import("./projet/fiche/fiche.module").then(m => m.FilesPageModule)
  },
  {
    path: "projet",
    loadChildren: () =>
      import("./projet/projet.module").then(m => m.ProjetPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
