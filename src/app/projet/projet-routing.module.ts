import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjetPage } from './projet.page';

const routes: Routes = [
  {
    path: '',
    component: ProjetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetPageRoutingModule {}
