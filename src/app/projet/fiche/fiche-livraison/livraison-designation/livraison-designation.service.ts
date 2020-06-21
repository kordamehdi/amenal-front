import { StockDesignationModel } from "./../../../models/stock-designation.model";
import { FicheModel } from "./../../../models/fiche.model";
import { FicheService } from "./../../fiche.service";
import { LivraisonDesignationModel } from "./../../../models/livraison.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import "rxjs/Rx";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheLivraisonAction from "../redux/fiche-livraison.action";
import { typeChange } from "../../header/head.selector";

@Injectable()
export class LivraisonDesignationService {
  SERVER_ADDRESS = "";
  FicheSelectionner: FicheModel;
  projetSelectionner;
  typeShow = "";
  constructor(
    private httpClient: HttpClient,
    private store: Store<App.AppState>,
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

    this.store.select(typeChange).subscribe(type => {
      this.typeShow = type;
    });
  }

  onAddLivraisonDesignation(ds: LivraisonDesignationModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    ds = { ...ds, idFiche: this.FicheSelectionner.id };
    this.httpClient
      .post<LivraisonDesignationModel>(
        this.SERVER_ADDRESS + "/designations/livraisons",
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "livDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateLivraisonDesignation(ds: LivraisonDesignationModel, idDs) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    ds = { ...ds, idFiche: this.FicheSelectionner.id };
    this.httpClient
      .put<LivraisonDesignationModel>(
        this.SERVER_ADDRESS + "/designations/livraisons/" + idDs,
        ds,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "livDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onDeleteLivraisonDesignation(idDs) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<LivraisonDesignationModel>(
        this.SERVER_ADDRESS + "/designations/livraisons/" + idDs,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "livDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetstockArticle() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params = new HttpParams().set("date", this.FicheSelectionner.date);
    this.httpClient
      .get<StockDesignationModel[]>(
        this.SERVER_ADDRESS +
          "/stocks/Articles/projets/" +
          this.projetSelectionner.id,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        stc => {
          this.store.dispatch(
            new fromFicheLivraisonAction.getStockArticle(stc)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "livDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
