import { FicheLocationComponent } from "./../fiche-location/fiche-location.component";
import { LongPress } from "./../../directives/long-press.directive";
import { TabComponent } from "../../custum-component/tab/tab.component";
import { DialogComponent } from "../../custum-component/dialog/dialog.component";
import { HasProjetDirective } from "../../directives/has-projet.directive";
import { AccueilComponent } from "./../../accueil/accueil.component";
import { LoadingComponent } from "./../../custum-component/loading/loading.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FichePageRoutingModule } from "./fiche-routing.module";

import { FichePage } from "./fiche.page";

import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";

import { FicheOuvrierComponent } from "./fiche-ouvrier/fiche-ouvrier.component";
import { FicheOuvrierDesignationComponent } from "./fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.component";
import { dateDiffPipe } from "src/app/pipe/dateDiff.pipe";
import { IgxTimePickerModule } from "igniteui-angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  providers: [],
  imports: [
    IgxTimePickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FichePageRoutingModule
  ],
  declarations: [
    FicheLocationComponent,
    LongPress,
    HasProjetDirective,
    LoadingComponent,
    dateDiffPipe,
    FicheOuvrierDesignationComponent,
    DialogComponent,
    FichePage,
    HeaderComponent,
    NavComponent,
    TabComponent,
    FicheOuvrierComponent,
    AccueilComponent
  ]
})
export class FilesPageModule {}
