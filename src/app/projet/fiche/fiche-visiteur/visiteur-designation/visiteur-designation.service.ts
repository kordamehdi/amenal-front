import { FicheService } from "./../../fiche.service";
import { ProjetModel } from "src/app/projet/models/projet.model";
import { Injectable } from "@angular/core";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { HttpClient } from "@angular/common/http";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheVisiteurAction from "../redux/fiche-visiteur.action";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";

@Injectable()
export class VisiteurDesignationService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  FicheSelectionner: FicheModel;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private ficheService: FicheService
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(ficheState => {
      this.projetSelectionner = ficheState.projetSelectionner;

      if (ficheState.Fiches.length > 0)
        this.FicheSelectionner =
          ficheState.Fiches[ficheState.FicheSelectionnerPosition];
    });
  }

  public onGetVisiteurAssoToProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<visiteurModel[]>(
        this.SERVER_ADDRESS +
          "/designations/visiteurs/projets/" +
          this.projetSelectionner.id +
          "/visiteurs",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.store.dispatch(
            new fromFicheVisiteurAction.getVisiteurAssoToProjet(vss)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "vsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onAddVisiteurDesignation(ds) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<visiteurModel>(
        this.SERVER_ADDRESS + "/designations/visiteurs",
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.ficheService.onGetFicheByType("VISITEUR", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "vsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onUpdateVisiteurDesignation(ds, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<visiteurModel>(
        this.SERVER_ADDRESS + "/designations/visiteurs/" + id,
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.ficheService.onGetFicheByType("VISITEUR", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "vsDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
