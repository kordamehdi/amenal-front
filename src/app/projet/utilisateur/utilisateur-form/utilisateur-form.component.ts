import { UtilisateurModel } from "./../../models/utilisateur.model";
import { Component, OnInit } from "@angular/core";
import { UtilisateurService } from "../utilisateur.service";
import * as fromFicheAction from "../../fiche/redux/fiche.action";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";

@Component({
  selector: "app-utilisateur-form",
  templateUrl: "./utilisateur-form.component.html",
  styleUrls: ["./utilisateur-form.component.scss"]
})
export class UtilisateurFormComponent implements OnInit {
  update = -1;
  errorMsg;
  showAlert = false;
  selectedDsId = -1;
  users;
  selectedDsIndex = -1;
  userWithRoles = [];
  constructor(
    private store: Store<App.AppState>,
    private UtilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.UtilisateurService.onListUser();
    this.store.select("projet").subscribe(state => {
      this.userWithRoles = state.usersWithRole;
      this.users = state.users;
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "userFrom") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onAddUtilisateur() {}
  onUpdateUtilisateur() {}
  onAddClick() {
    this.update = 0;
  }
  onAddClickOutside(usrInpt, pwdInpt) {
    if (this.update === 0) {
      let usr = usrInpt.value;
      let pwd = pwdInpt.value;
      if (usr.trim() === "" || pwd.trim() === "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "userFrom",
            msg: "les deux champs USERNAME et PASSWORD son obligatoire!"
          })
        );
      } else {
        let user: UtilisateurModel = {
          password: pwd,
          username: usr,
          isRoot: false,
          roles: null
        };
        this.UtilisateurService.onAddUser(user);
        usrInpt.value = "";
        pwdInpt.value = "";
      }
      this.update = -1;
    }
  }

  onDelete(usr, id) {
    let users = this.userWithRoles.map(u => u.username);
    if (usr !== "root")
      if (users.includes(usr))
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "userFrom",
            showAlert: true,
            msg: "Vous ne pouvez pas supprimez cette utilisateur"
          })
        );
      else {
        this.selectedDsId = id;

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "userFrom",
            showAlert: true,
            msg:
              "Est ce que vous etes sure de vouloire suprimer l' utilisateur [ " +
              usr +
              " ]"
          })
        );
      }
  }

  onContinue() {
    if (this.selectedDsId !== -1) {
      this.UtilisateurService.onSupprimerUser(this.selectedDsId);
      this.selectedDsId = -1;
    }
    this.onCancel();
  }
  onCancel() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "userFrom",
        showAlert: false,
        msg: ""
      })
    );
  }
}
