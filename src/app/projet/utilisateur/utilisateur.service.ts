import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import * as App from "../../store/app.reducers";
import {
  UtilisateurModel,
  UtilisateurWithRoleCommandeModel
} from "../models/utilisateur.model";
import * as fromProjetAction from "../redux/projet.actions";
import * as fromFicheAction from "../fiche/redux/fiche.action";

@Injectable()
export class UtilisateurService {
  SERVER_ADDRESS = "";

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
  }

  onAddUser(user) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<UtilisateurModel[]>(this.SERVER_ADDRESS + "/user", user, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fiches => {
          this.onListUser();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onUpdateUser(user, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<UtilisateurModel[]>(this.SERVER_ADDRESS + "/user/" + id, user, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fiches => {
          this.onListUser();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onListUser() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<UtilisateurModel[]>(this.SERVER_ADDRESS + "/user", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        us => {
          this.store.dispatch(new fromProjetAction.GetUsers(us));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onSupprimerUser(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<UtilisateurModel>(this.SERVER_ADDRESS + "/user/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fiches => {
          this.onListUser();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onSupprimerUserRoleAsso(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<UtilisateurModel>(this.SERVER_ADDRESS + "/user/role/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fiches => {
          this.onListerRoleToUser();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAddRoleToUser(user: UtilisateurWithRoleCommandeModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<UtilisateurWithRoleCommandeModel>(
        this.SERVER_ADDRESS + "/user/role",
        user,

        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onListerRoleToUser();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onListerRoleToUser() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<UtilisateurModel[]>(this.SERVER_ADDRESS + "/user/role", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        uss => {
          this.store.dispatch(new fromProjetAction.GetUsersWithRole(uss));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "userFrom",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
