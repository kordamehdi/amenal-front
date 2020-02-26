import { FicheOuvrierDesignationService } from "./fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { OuvrierModel } from "./../../models/ouvrier.model";
import { OnInit } from "@angular/core";

import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import { HttpClient, HttpRequest } from "@angular/common/http";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheOuvrierAction from "./redux/fiche-ouvrier.action";
import { ProjetModel } from "../../models/projet.model";
@Injectable()
export class FicheOuvrierService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  ouvrierRemovingId: number;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService
  ) {
    this.store.select("fiche").subscribe(ficheState => {
      this.projetSelectionner = ficheState.projetSelectionner;
    });
    this.store.select("ficheOuvrier").subscribe(ficheOuvState => {
      this.ouvrierRemovingId = ficheOuvState.ouvrierRemovingId;
    });
  }

  public GetFicheOuvrierState() {
    return this.store.select("ficheOuvrier");
  }

  public OnSaveOuvrier(ouvrier: OuvrierModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "POST",
      this.SERVER_ADDRESS + "/ouvriers",
      ouvrier,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.onGetOuvriers();
      },
      resp => {
        this.store.dispatch(
          new fromFicheOuvrierAction.ShowAlert({
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }
  public OnUpdateOuvrier(ouvrier: OuvrierModel, ouvrierID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "PUT",
      this.SERVER_ADDRESS + "/ouvriers/" + ouvrierID,
      ouvrier,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.onGetOuvriers();
      },
      resp => {
        this.store.dispatch(
          new fromFicheOuvrierAction.ShowAlert({
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }

  public onGetOuvriers() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<OuvrierModel[]>(this.SERVER_ADDRESS + "/ouvriers", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        ouvriers => {
          this.store.dispatch(new fromFicheOuvrierAction.GetOuvrier(ouvriers));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheOuvrierAction.ShowAlert({
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onAddOuvrierToProjet(idOuvrier) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    console.log(this.projetSelectionner);
    this.httpClient
      .put<OuvrierModel[]>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/ouvriers/" +
          idOuvrier,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetOuvriers();
          this.ficheOuvrierDesignationService.onGetOuvrierByProjet();
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(new fromProjetAction.IsBlack(true));
          this.store.dispatch(
            new fromFicheOuvrierAction.ShowAlert({
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public OnDeleteOuvrier() {
    if (this.ouvrierRemovingId !== -1) {
      this.store.dispatch(new fromProjetAction.IsBlack(true));
      const req = new HttpRequest(
        "DELETE",
        this.SERVER_ADDRESS + "/ouvriers/" + this.ouvrierRemovingId,
        {
          reportProgress: true
        }
      );
      this.httpClient.request(req).subscribe(
        () => {
          this.store.dispatch(
            new fromFicheOuvrierAction.FinishRemovingOuvrier()
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetOuvriers();
        },
        resp => {
          this.store.dispatch(
            new fromFicheOuvrierAction.ShowAlert({
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
    }
  }
}
