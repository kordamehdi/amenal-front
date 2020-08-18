import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { HeightList } from "./directives/HeightList.directive";
import { UtilisateurComponent } from "./projet/utilisateur/utilisateur.component";
import { ProjetTabComponent } from "./projet/fiche/projet-tab/projet-tab.component";
import { LoginComponent } from "src/app/login/login.component";
import { HeaderComponent } from "./projet/fiche/header/header.component";
import { NgModule } from "@angular/core";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { minToHrsPipe } from "./pipe/minToHours.pipe";
import { LongPress } from "./directives/long-press.directive";
import { HasProjetDirective } from "./directives/has-projet.directive";
import { LoadingComponent } from "./custum-component/loading/loading.component";
import { dateDiffPipe } from "./pipe/dateDiff.pipe";
import { TabComponent } from "./custum-component/tab/tab.component";
import { DialogComponent } from "./custum-component/dialog/dialog.component";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./store/app.reducers";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicModule } from "@ionic/angular";
import { NavComponent } from "./projet/fiche/nav/nav.component";
import { AppRoutingModule } from "./app-routing.module";
import { UtilisateurFormComponent } from "./projet/utilisateur/utilisateur-form/utilisateur-form.component";
import { RouterModule } from "@angular/router";
import { HeightFiche } from "./directives/HeightFiche.directive";
@NgModule({
  declarations: [
    HeightList,
    ProjetTabComponent,
    LoginComponent,
    UtilisateurFormComponent,
    UtilisateurComponent,
    HeaderComponent,
    SidebarComponent,
    HeightFiche,
    minToHrsPipe,
    LongPress,
    NavComponent,
    HasProjetDirective,
    LoadingComponent,
    dateDiffPipe,
    TabComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule.forRoot({
      scrollPadding: false
    })
  ],
  exports: [
    HeightList,
    HeightFiche,
    RouterModule,
    ProjetTabComponent,
    LoginComponent,
    UtilisateurFormComponent,
    UtilisateurComponent,
    HeaderComponent,
    SidebarComponent,
    minToHrsPipe,
    LongPress,
    NavComponent,
    HasProjetDirective,
    LoadingComponent,
    dateDiffPipe,
    TabComponent,
    DialogComponent,
    CommonModule,
    ClickOutsideModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule,
    IonicModule
  ]
})
export class SharedModule {}
