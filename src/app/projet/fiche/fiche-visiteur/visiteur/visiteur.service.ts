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
export class VisiteurService {
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

      if (ficheState.ficheSelectionner !== null)
        this.FicheSelectionner = ficheState.ficheSelectionner;
    });
  }

  public onAddVisiteur(visiteur) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<visiteurModel[]>(
        this.SERVER_ADDRESS +
          "/visiteurs/projets/" +
          this.projetSelectionner.id,
        visiteur,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.onGetVisiteur();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onDeleteVisiteur(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<visiteurModel[]>(
        this.SERVER_ADDRESS +
          "/visiteurs/" +
          id +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.onGetVisiteur();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onUpdateVisiteur(visiteur, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<visiteurModel[]>(
        this.SERVER_ADDRESS + "/visiteurs/" + id,
        visiteur,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.onGetVisiteur();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onAssoVisiteurToProjet(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<visiteurModel[]>(
        this.SERVER_ADDRESS +
          "/visiteurs/" +
          id +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onGetVisiteur();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  public onGetVisiteur() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<visiteurModel[]>(
        this.SERVER_ADDRESS +
          "/visiteurs/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        vss => {
          this.store.dispatch(new fromFicheVisiteurAction.getVisiteur(vss));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  public onImportExcelFileVisiteur(file: File) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let formdata: FormData = new FormData();

    formdata.append("excelFile", file);

    this.httpClient
      .post<any>(this.SERVER_ADDRESS + "/excel/visiteurs", formdata)
      .subscribe(
        qls => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetVisiteur();
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "visiteur",
              msg: "importer avec succées"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "visiteur",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
