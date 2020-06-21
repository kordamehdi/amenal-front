import { MaterielModel } from "./../../../models/materiel.model";
import { MaterielCmdModel } from "./../../../models/materiel-commande.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheLocationAction from "./../redux/fiche-location.action";
import * as fromFicheAction from "../../redux/fiche.action";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class FicheMaterielService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner;
  FicheSelectionner;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(ficheState => {
      if (ficheState.ficheSelectionner !== null)
        this.FicheSelectionner = ficheState.ficheSelectionner;
      this.projetSelectionner = ficheState.projetSelectionner;
    });
  }

  onAddUnite(nom) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .post<String>(this.SERVER_ADDRESS + "/unites", nom, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fours => {
          this.onGetUnite();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          new fromFicheAction.ShowFicheAlert({
            type: "unite",
            showAlert: true,
            msg: resp.error.message
          });
        }
      );
  }
  onDeleteUnite(nom) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/unites/" + nom, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        dd => {
          this.onGetUnite();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "unite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onGetUnite() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<string[]>(this.SERVER_ADDRESS + "/unites", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        us => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheLocationAction.GetUnite(us));
        },
        resp => {
          new fromFicheAction.ShowFicheAlert({
            type: "unite",
            showAlert: true,
            msg: resp.error.message
          });
        }
      );
  }
}
