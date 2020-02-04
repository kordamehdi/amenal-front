import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FilesPageRoutingModule } from "./files-routing.module";

import { FilesPage } from "./files.page";

import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";

import { TabComponent } from "./tab/tab.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FilesPageRoutingModule],
  declarations: [FilesPage, HeaderComponent, NavComponent, TabComponent]
})
export class FilesPageModule {}
