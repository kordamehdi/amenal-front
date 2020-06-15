import { FicheService } from "./../../fiche.service";
import { documentModel } from "./../../../models/fiche-document.model";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { ProjetModel } from "src/app/projet/models/projet.model";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromFicheDocumentAction from "../redux/fiche-document.action";
@Injectable()
export class DocumentSerive {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  ouvrierRemovingId: number;

  constructor(
    private ficheService: FicheService,
    private store: Store<App.AppState>,
    private httpClient: HttpClient
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

  public OnSaveDocument(intitule) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<string>(this.SERVER_ADDRESS + "/documents/", intitule, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.OnGetDocuments();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "document",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public OnGetDocuments() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<documentModel[]>(
        this.SERVER_ADDRESS +
          "/documents/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dcs => {
          this.store.dispatch(new fromFicheDocumentAction.getDocument(dcs));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "document",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public OnUpdateDocument(intitule, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<documentModel[]>(
        this.SERVER_ADDRESS + "/documents/" + id,
        intitule,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dcs => {
          this.OnGetDocuments();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "document",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public OnAssoDocumentToProjet(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<documentModel[]>(
        this.SERVER_ADDRESS +
          "/documents/" +
          id +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dcs => {
          this.OnGetDocuments();
          this.ficheService.onGetFicheByType("DOCUMENT", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "document",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public OnDeleteDocument(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/documents/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        dcs => {
          this.OnGetDocuments();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "document",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public OnUpdtDisponilibte(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(this.SERVER_ADDRESS + "/documents/designation/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        dcs => {
          this.ficheService.onGetFicheByType("DOCUMENT", null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "documentDs",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onImportExcelFileDocument(file: File) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let formdata: FormData = new FormData();

    formdata.append("excelFile", file);

    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/excel/documents", formdata)
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.OnGetDocuments();
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "document",
              msg: "importer avec succées"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "document",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
