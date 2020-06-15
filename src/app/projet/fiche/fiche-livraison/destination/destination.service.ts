import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/Rx";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheLivraisonAction from "../redux/fiche-livraison.action";
import { destinationModel } from "src/app/projet/models/destination.model";

@Injectable()
export class DestinationService {
  SERVER_ADDRESS = "";
  FicheSelectionner;
  projetSelectionner;
  constructor(
    private httpClient: HttpClient,
    private store: Store<App.AppState>
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
    this.store.select("fiche").subscribe(ficheState => {
      this.FicheSelectionner =
        ficheState.Fiches[ficheState.FicheSelectionnerPosition];
      this.projetSelectionner = ficheState.projetSelectionner;
    });
  }
  onGetDestinations() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<destinationModel[]>(
        this.SERVER_ADDRESS + "/destination/" + this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dsts => {
          this.store.dispatch(
            new fromFicheLivraisonAction.getDestination(dsts)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetDestinationsAssoToProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<destinationModel[]>(
        this.SERVER_ADDRESS +
          "/destination/projet/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dsts => {
          this.store.dispatch(
            new fromFicheLivraisonAction.getDestinationAssoToProjet(dsts)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onAssoDstToProjet(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<destinationModel[]>(
        this.SERVER_ADDRESS +
          "/destination/" +
          id +
          "/projet/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onGetDestinations();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  AddDestination(dst) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/destination", dst, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fours => {
          this.onGetDestinations();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  UpdateDestination(dst, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<any>(this.SERVER_ADDRESS + "/destination/" + id, dst, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fours => {
          this.onGetDestinations();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  DeleteDestination(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/destination/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fours => {
          this.onGetDestinations();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onImportExcelFileDestination(file: File) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let formdata: FormData = new FormData();

    formdata.append("excelFile", file);

    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/excel/destinations", formdata)
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetDestinations();
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "destination",
              msg: "importer avec succées"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "destination",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
