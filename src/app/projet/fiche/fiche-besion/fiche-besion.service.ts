import { FicheService } from "./../fiche.service";
import { besoinDesignationModel } from "./../../models/besion.model";
import { Injectable } from "@angular/core";
import { ProjetModel } from "../../models/projet.model";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import { Router } from "@angular/router";
import * as fromProjetAction from "../../redux/projet.actions";
import * as FromFicheAction from "../redux/fiche.action";
import * as fromFicheBesionAction from "./redux/besion.action";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FicheBesionService {
  SERVER_ADDRESS = "";
  projetSelectionner: ProjetModel;
  fiches;
  ficheSelectionnerId;
  typeSelectionner;
  FicheSelectionner;
  listAll;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private ficheService: FicheService
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
  onAddBesionDesignation(ds: besoinDesignationModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    ds = { ...ds, idFiche: this.FicheSelectionner.id };

    this.httpClient
      .post<besoinDesignationModel>(
        this.SERVER_ADDRESS + "/besoins/designations",
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("BESOIN", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "BsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateBesionDesignation(ds: besoinDesignationModel, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    ds = { ...ds, idFiche: this.FicheSelectionner.id };

    this.httpClient
      .put<besoinDesignationModel>(
        this.SERVER_ADDRESS + "/besoins/designations/" + id,
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("BESOIN", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "BsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onDeleteBesionDesignation(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<besoinDesignationModel>(
        this.SERVER_ADDRESS + "/besoins/designations/" + id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("BESOIN", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "BsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  listerBesion() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<any>(this.SERVER_ADDRESS + "/besoins", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        dss => {
          this.store.dispatch(new fromFicheBesionAction.getListBesion(dss));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "BsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
