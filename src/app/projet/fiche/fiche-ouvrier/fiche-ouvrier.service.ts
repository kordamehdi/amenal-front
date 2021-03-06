import { FicheOuvrierDesignationService } from "./fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { OuvrierModel } from "./../../models/ouvrier.model";

import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import { HttpClient, HttpRequest } from "@angular/common/http";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheOuvrierAction from "./redux/fiche-ouvrier.action";
import { ProjetModel } from "../../models/projet.model";
import * as fromFicheAction from "../redux/fiche.action";
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
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

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
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "ouvrier",
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
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "ouvrier",
            msg: resp.error.message
          })
        );
      }
    );
  }

  public onGetOuvriers() {
    console.log("onGetOuvriers");
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<OuvrierModel[]>(
        this.SERVER_ADDRESS + "/ouvriers/projets/" + this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        ouvriers => {
          this.store.dispatch(new fromFicheOuvrierAction.GetOuvrier(ouvriers));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
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
          this.store.dispatch(new fromFicheOuvrierAction.IsUpdate(-1));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetOuvriers();
          this.ficheOuvrierDesignationService.onGetOuvrierByProjet();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ouvrier",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public OnDeleteOuvrier(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "DELETE",
      this.SERVER_ADDRESS + "/ouvriers/" + id,
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
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ouvrier",
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }
  public OnDeleteQualification(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "DELETE",
      this.SERVER_ADDRESS + "/ouvriers/qualifications/" + id,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.onGetQualifications();
      },
      resp => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ouvrier",
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }
  public OnDeleteVille(v) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "DELETE",
      this.SERVER_ADDRESS + "/villes/" + v,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.onGetVilles();
      },
      resp => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ouvrier",
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }

  public OnDeleteApprec(v) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    const req = new HttpRequest(
      "DELETE",
      this.SERVER_ADDRESS + "/appreciations/" + v,
      {
        reportProgress: true
      }
    );
    this.httpClient.request(req).subscribe(
      () => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.onGetAppreciations();
      },
      resp => {
        this.store.dispatch(new fromProjetAction.IsBlack(false));
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ouvrier",
            showAlert: true,
            msg: resp.error.message
          })
        );
      }
    );
  }
  public addQualification(qual) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<String>(this.SERVER_ADDRESS + "/ouvriers/qualifications", qual, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetQualifications();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }
  public addVille(v) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    return this.httpClient
      .post<String>(this.SERVER_ADDRESS + "/villes", v, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetVilles();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }
  public addApprec(apprec) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<String>(this.SERVER_ADDRESS + "/appreciations", apprec, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetAppreciations();
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onGetQualifications() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<String[]>(this.SERVER_ADDRESS + "/ouvriers/qualifications", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheOuvrierAction.GetDesignations(qls));
          this.store.dispatch(new fromFicheOuvrierAction.villeAded());
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onGetVilles() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<string[]>(this.SERVER_ADDRESS + "/villes", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheOuvrierAction.GetVilles(qls));
          this.store.dispatch(new fromFicheOuvrierAction.villeAded());
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onGetAppreciations() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<string[]>(this.SERVER_ADDRESS + "/appreciations", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheOuvrierAction.GetApprec(qls));
          this.store.dispatch(new fromFicheOuvrierAction.villeAded());
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onImportExcelFileOuvrier(file: File) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let formdata: FormData = new FormData();

    formdata.append("excelFile", file);

    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/excel", formdata)
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetOuvriers();
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: "importer avec succées"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
