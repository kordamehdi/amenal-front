import { entreeNonAssoModel } from "./../../models/lot.model";
import { accidentModel } from "./../../models/accident.model";
import { FicheService } from "./../fiche.service";
import { FicheModel } from "./../../models/fiche.model";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheAction from "../redux/fiche.action";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as fromFicheActiviteAction from "./redux/fiche-activite.action";
import {
  EntreeDesignationNonAssoModel,
  lotAssoModel,
  sousLotDesignationModel
} from "../../models/fiche-activite.model";
import { typeChange } from "../header/head.selector";

@Injectable()
export class FicheActiviteService {
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
      this.FicheSelectionner = ficheState.ficheSelectionner;
      this.projetSelectionner = ficheState.projetSelectionner;
    });
    this.store.select(typeChange).subscribe(type => {
      this.typeShow = type;
    });
  }

  OnDeleteDesignation(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/activite/designation/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnListEntreeDesignationNoAsso() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params = new HttpParams().set("date", this.FicheSelectionner.date);
    this.httpClient
      .get<sousLotDesignationModel[]>(
        this.SERVER_ADDRESS +
          "/activite/entree/sousLot/projet/" +
          this.projetSelectionner.id,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        entrees => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheActiviteAction.getEntreeDesignationNonAssoBySousLot(
              entrees
            )
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  OnlistLotParProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<lotAssoModel[]>(
        this.SERVER_ADDRESS +
          "/activite/lot/projet/" +
          this.projetSelectionner.id +
          "/fiche/" +
          this.FicheSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        lotAssos => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheActiviteAction.getLotAssoToProjet(lotAssos)
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAddActiviteDesignation(lotId) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<accidentModel>(
        this.SERVER_ADDRESS +
          "/activite/lot/" +
          lotId +
          "/fiche/" +
          this.FicheSelectionner.id +
          "/projet/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnlistSousLotParProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<lotAssoModel[]>(
        this.SERVER_ADDRESS +
          "/activite/sousLot/lot/projet/" +
          this.projetSelectionner.id +
          "/fiche/" +
          this.FicheSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        slotAssos => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheActiviteAction.getSousLotAssoToProjet(slotAssos)
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onAddSousLotDesignation(lotId, cmd) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<accidentModel>(
        this.SERVER_ADDRESS + "/activite/sousLot/designation/" + lotId,
        cmd,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onAddEntreeToSousLotDesignation(sLotDsId, entreeDsCmd) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<any>(
        this.SERVER_ADDRESS + "/activite/entree/sousLot/" + sLotDsId,
        entreeDsCmd,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.ficheService.onGetFicheByType("ACTIVITE", null);
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onUpdateEntreeToSousLotDesignation(entreeId, entreeDsCmd) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS + "/activite/entree/" + entreeId,
        entreeDsCmd,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onDeleteSousLotDesignation(sLotDs) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/activite/sousLot/" + sLotDs, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onDeleteEntreeDesignation(entreeID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/activite/entree/" + entreeID, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onUpdateSousLotDesignation(sLotDsId, cmd) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(this.SERVER_ADDRESS + "/activite/sousLot/" + sLotDsId, cmd, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
