import { accidentModel } from "./../../models/accident.model";
import { FicheService } from "./../fiche.service";
import { FicheModel } from "./../../models/fiche.model";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheAction from "../redux/fiche.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class FicheAccidentService {
  SERVER_ADDRESS = "";
  FicheSelectionner: FicheModel;
  projetSelectionner;
  constructor(
    private httpClient: HttpClient,
    private store: Store<App.AppState>,
    private ficheService: FicheService
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
    this.store.select("fiche").subscribe(ficheState => {
      this.FicheSelectionner = ficheState.ficheSelectionner;
      this.projetSelectionner = ficheState.projetSelectionner;
    });
  }

  onAddAccident(acc) {
    let ac: accidentModel = { ...acc, ficheID: this.FicheSelectionner.id };
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<accidentModel>(
        this.SERVER_ADDRESS + "/designations/accidents",
        ac,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.ficheService.onGetFicheByType("ACCIDENT", null);
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "accidentDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onUpdateAccident(acc, id) {
    let ac: accidentModel = { ...acc, ficheID: this.FicheSelectionner.id };
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<accidentModel>(
        this.SERVER_ADDRESS + "/designations/accidents/" + id,
        ac,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.ficheService.onGetFicheByType("ACCIDENT", null);
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "accidentDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onDeleteAccident(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<accidentModel>(
        this.SERVER_ADDRESS + "/designations/accidents/" + id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.ficheService.onGetFicheByType("ACCIDENT", null);
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "accidentDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
