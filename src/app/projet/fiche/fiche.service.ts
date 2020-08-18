import { FicheModel } from "./../models/fiche.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import * as App from "../../store/app.reducers";
import * as fromProjetAction from "../redux/projet.actions";
import * as fromFicheAction from "./redux/fiche.action";

import { ProjetModel } from "../models/projet.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
@Injectable()
export class FicheService {
  SERVER_ADDRESS = "";
  projetSelectionner: ProjetModel;
  fiches;
  ficheSelectionnerId;
  ficheSelectionner: FicheModel;
  typeSelectionner;
  listAll;
  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(projetState => {
      this.projetSelectionner = projetState.projetSelectionner;
      if (projetState.ficheSelectionner !== null) {
        this.ficheSelectionnerId = projetState.ficheSelectionner.id;
        this.ficheSelectionner = projetState.ficheSelectionner;
      }

      this.listAll = projetState.listAll;
      this.typeSelectionner = projetState.typeSelectionner;
    });
  }

  validerFiche(id, type) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<FicheModel[]>(this.SERVER_ADDRESS + "/fiches/" + type + "/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onGetFicheByTypeAndDate(
            this.ficheSelectionner.type,
            this.ficheSelectionner.date.toString()
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: "fiche valider avec succer!"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetFicheByType(ficheType: String, route) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params;
    params = new HttpParams().set(
      "date",
      this.ficheSelectionner.date.toString()
    );

    this.httpClient
      .get<FicheModel>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiche/" +
          ficheType,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fiche => {
          this.store.dispatch(new fromFicheAction.RefreshFiche(fiche));

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onGetFicheWithRoute(ficheType: String) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params;
    params = new HttpParams().set(
      "date",
      this.projetSelectionner.fin.toString()
    );

    this.httpClient
      .get<FicheModel>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiche/" +
          ficheType,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fiche => {
          this.store.dispatch(new fromFicheAction.RefreshFiche(fiche));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetFicheByTypeAndDate(ficheType: String, date) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params;
    console.log(this.projetSelectionner);
    params = new HttpParams().set("date", date);

    this.httpClient
      .get<FicheModel>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiche/" +
          ficheType,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fiche => {
          this.store.dispatch(new fromFicheAction.RefreshFiche(fiche));
        },
        resp => {
          console.log(resp.error.message);

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
