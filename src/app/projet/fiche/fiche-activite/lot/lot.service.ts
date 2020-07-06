import { FicheService } from "./../../fiche.service";
import { FicheModel } from "./../../../models/fiche.model";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromFicheActiviteAction from "../redux/fiche-activite.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lotModel } from "src/app/projet/models/lot.model";

@Injectable()
export class LotService {
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

  onAddlot(lot) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<String>(
        this.SERVER_ADDRESS + "/lots/projets/" + this.projetSelectionner.id,
        lot,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateLot(lot, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<String>(this.SERVER_ADDRESS + "/lots/" + id, lot, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.onListLot();
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onListLot() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<lotModel[]>(
        this.SERVER_ADDRESS + "/lots/projets/" + this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        lots => {
          this.store.dispatch(new fromFicheActiviteAction.addLot(lots));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onAddSousLot(slot) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/SousLots", slot, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateSousLot(slot, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(this.SERVER_ADDRESS + "/SousLots/" + id, slot, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onListEntreeNonAsso() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<any>(this.SERVER_ADDRESS + "/SousLots/entrees", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        ee => {
          this.store.dispatch(new fromFicheActiviteAction.getEntreeNonAsso(ee));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAddEntreeToSousLot(entree, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/SousLots/" + id + "/entrees", entree, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateEntree(entree, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(this.SERVER_ADDRESS + "/SousLots/entrees/" + id, entree, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
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
          this.store.dispatch(new fromFicheActiviteAction.getUnite(us));
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
  onDeleteLot(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/lots/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        us => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onDeleteSousLot(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/SousLots/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        us => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAssoLotToProjet(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/lots/" +
          id +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        us => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAssoSousLotToProjet(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/SousLots/" +
          id +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        us => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  onDeleteEntree(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/SousLots/entrees/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        us => {
          this.onListLot();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
}
