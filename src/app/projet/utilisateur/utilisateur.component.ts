import { ProjetModel } from "./../models/projet.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as App from "./../../store/app.reducers";
import { ProjetService } from "../fiche/projet-tab/projet-tab.service";
import * as fromFicheAction from "../fiche/redux/fiche.action";
import { Router } from "@angular/router";
import { LoginService } from "src/app/login/login.service";
import { GET_USERS } from "../redux/projet.actions";
import {
  UtilisateurWithRoleCommandeModel,
  UtilisateurModel
} from "../models/utilisateur.model";
import { UtilisateurService } from "./utilisateur.service";

@Component({
  selector: "app-utilisateur",
  templateUrl: "./utilisateur.component.html",
  styleUrls: ["./utilisateur.component.scss"]
})
export class UtilisateurComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;
  projets: ProjetModel[];
  update = -1;
  projetSelected = false;
  userSelected = false;
  formNames = ["username", "projet", "role"];
  errorMsg;
  userWithRoles: UtilisateurModel[] = [
    {
      username: "sssss",
      isRoot: false,
      password: null,
      roles: [
        {
          id: 1,
          projet: "sss",
          role: "ADMIN"
        }
      ]
    }
  ];
  showDetails = [];
  showAlert;
  users;
  showSideBar;
  constructor(
    private store: Store<App.AppState>,
    private projetService: ProjetService,
    private router: Router,
    private loginService: LoginService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.projetService.listerProjet();
    this.utilisateurService.onListerRoleToUser();
    this.store.select("projet").subscribe(state => {
      this.userWithRoles = state.usersWithRole;
      this.projets = state.projets;
      this.users = state.users.filter(u => {
        return !u.isRoot;
      });
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "user") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }
  onFocusUserInput(usrs) {
    usrs.hidden = false;
  }
  onBlurUserInput(usrs) {
    setTimeout(() => {
      usrs.hidden = true;
      if (!this.userSelected) this.form.controls["username"].reset();
    }, 100);
  }
  onSelectUser(p) {
    this.userSelected = true;
    this.form.controls["username"].setValue(p.username);
  }

  onFocusProjetInput(prt) {
    prt.hidden = false;
  }
  onBlurProjetInput(prt) {
    setTimeout(() => {
      prt.hidden = true;
      if (!this.projetSelected) this.form.controls["projet"].reset();
    }, 100);
  }
  onSelectProjet(p: ProjetModel) {
    this.projetSelected = true;
    this.form.controls["projet"].setValue(p.abreveation);
  }
  onAddUtilisateur() {
    let user: UtilisateurWithRoleCommandeModel = {
      username: this.form.value["username"],
      pid: this.projets.find(p => p.abreveation === this.form.value["projet"])
        .id,
      role: this.form.value["role"]
    };
    this.utilisateurService.onAddRoleToUser(user);
    this.update = -1;
    this.form.reset();
  }

  onAddClick() {
    this.update = 0;
  }

  onAddClickOutside() {
    if (this.update === 0 && this.form.dirty) {
      let submit = true;
      this.formNames.forEach(key => {
        if (this.form.controls[key].invalid) {
          submit = false;
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "user",
              showAlert: true,
              msg: "Le champs [ " + key + " ] est invalid!"
            })
          );
        }
      });
      if (submit) {
        this.form.ngSubmit.emit();
      } else this.update = -1;
    }
  }

  /*** */
  onHideSideBar() {
    this.showSideBar = false;
  }

  onShowSideBar(ev) {
    console.log(ev);
    this.showSideBar = true;
  }

  /*** */
  onContinue() {
    this.onCancel();
  }
  onShowshowDetail(i) {
    this.showDetails[i] = !this.showDetails[i];
  }
  onCancel() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "user",
        showAlert: false,
        msg: ""
      })
    );
  }
  onLogOut() {
    this.loginService.logout();
  }
}
