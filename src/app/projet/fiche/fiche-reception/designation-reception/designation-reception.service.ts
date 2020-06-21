import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import {
  ReceptionCategorieModel,
  ReceptionDesignationModel
} from "./../../../models/reception-designation.model";
import { FicheService } from "./../../fiche.service";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as FromFicheAction from "../../redux/fiche.action";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";

@Injectable()
export class DesignationReceptionService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner;
  FicheSelectionner;

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
  onAddReceptionDesignation(ds: ReceptionDesignationModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    ds = { ...ds, idFiche: this.FicheSelectionner.id };

    this.httpClient
      .post<ReceptionDesignationModel>(
        this.SERVER_ADDRESS + "/designations/receptions",
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("RECEPTION", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "recDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onUpdateReceptionDesignation(ds: ReceptionDesignationModel, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    ds = { ...ds, idFiche: this.FicheSelectionner.id };

    this.httpClient
      .put<ReceptionDesignationModel>(
        this.SERVER_ADDRESS + "/designations/receptions/" + id,
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("RECEPTION", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.ficheService.onGetFicheByType("RECEPTION", null);
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "recDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  onDeleteReceptionDesignation(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<ReceptionDesignationModel>(
        this.SERVER_ADDRESS + "/designations/receptions/" + id,

        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dss => {
          this.ficheService.onGetFicheByType("RECEPTION", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "recDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  onGetFornisseurArticleByProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<fournisseurArticleModel[]>(
        this.SERVER_ADDRESS +
          "/designations/receptions/projets/" +
          this.projetSelectionner.id +
          "/fournisseurs",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        (frs: fournisseurArticleModel[]) => {
          this.store.dispatch(
            new fromFicheReceptionAction.getfournisseurArticleToSelect(frs)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "recDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
}
