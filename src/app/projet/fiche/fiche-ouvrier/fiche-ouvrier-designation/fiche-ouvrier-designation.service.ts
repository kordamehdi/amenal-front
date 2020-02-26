import { FicheModel } from "./../../../models/fiche.model";
import { ProjetModel } from "./../../../models/projet.model";
import { Store } from "@ngrx/store";
import { HttpClient, HttpRequest } from "@angular/common/http";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheOuvrierAction from "../redux/fiche-ouvrier.action";
import * as fromFicheAction from "../../redux/fiche.action";
import * as App from "../../../../store/app.reducers";
import { OuvrierModel } from "src/app/projet/models/ouvrier.model";
import { Injectable, OnInit } from "@angular/core";
import { ouvrierDesignationModel } from "src/app/projet/models/ouvrierDesignation.model";
import { FicheService } from "../../fiche.service";

@Injectable()
export class FicheOuvrierDesignationService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  FicheSelectionner: FicheModel;
  OuvDsRemovingId;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private ficheService: FicheService
  ) {
    this.store.select("fiche").subscribe(ficheState => {
      this.projetSelectionner = ficheState.projetSelectionner;
      this.FicheSelectionner =
        ficheState.Fiches[ficheState.FicheSelectionnerPosition];
      this.OuvDsRemovingId = ficheState.DsRemovingId;
    });
  }

  public onGetOuvrierByProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<OuvrierModel[]>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiches/" +
          this.FicheSelectionner.id +
          "/ouvriers",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        ouvriers => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheAction.GetOuvrierByProjet(ouvriers));
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

  public OnSaveOuvrierDesignation(ouvrierDS: ouvrierDesignationModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "POST",
      this.SERVER_ADDRESS + "/designations",
      ouvrierDS,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.ficheService.onGetFicheByType("OUVRIER", null);
        this.onGetOuvrierByProjet();
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
  public OnUpdateOuvrierDesignation(
    ouvrierDS: ouvrierDesignationModel,
    ouvrierDsid
  ) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "PUT",
      this.SERVER_ADDRESS + "/designations/" + ouvrierDsid,
      ouvrierDS,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.ficheService.onGetFicheByType("OUVRIER", null);
        this.onGetOuvrierByProjet();
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

  public OnDeleteOuvrierDesignation() {
    if (this.OuvDsRemovingId !== -1) {
      this.store.dispatch(new fromProjetAction.IsBlack(true));
      const req = new HttpRequest(
        "DELETE",
        this.SERVER_ADDRESS + "/designations/" + this.OuvDsRemovingId,

        {
          reportProgress: true
        }
      );
      this.httpClient.request(req).subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheAction.FinishRemovingDs());
          this.ficheService.onGetFicheByType("OUVRIER", null);
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowAlert({
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
    }
  }
}
