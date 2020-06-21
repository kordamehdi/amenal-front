import { FicheModel } from "./../../../models/fiche.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import * as fromFicheAction from "../../redux/fiche.action";
import { ProjetModel } from "src/app/projet/models/projet.model";
@Injectable()
export class FournisseurArticleService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  FicheSelectionner: FicheModel;
  type = "RECEPTION";
  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient
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

  getFournisseurNotAsso() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<any>(this.SERVER_ADDRESS + "/reception/fournisseurs/", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        fs => {
          this.store.dispatch(
            new fromFicheReceptionAction.getFournisseurArticleNonAsso(fs)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  getFournisseurAsso() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fs => {
          this.store.dispatch(
            new fromFicheReceptionAction.getFournisseurArticleAsso(fs)
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  OnAddFournisseur(idFr, nom) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<any>(
        this.SERVER_ADDRESS + "/reception/fournisseurs/" + idFr,
        { id: null, fournisseurNom: nom },
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.getFournisseurNotAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  assoArticleToFournisseur(idFr, idArt) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/articles/" +
          idArt,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  desAssoArticleToFournisseur(idFr, idArt) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/articles/" +
          idArt,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  onAssoFourToProjet(idFr) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  assoArticleFournisseurToProjet(idFr, idArt) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/articles/" +
          idArt +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  assoCategorieFournisseurToProjet(idFr, idCat) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/categories/" +
          idCat +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnDeleteFournisseurArticle(idFr) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(
        this.SERVER_ADDRESS + "/fournisseurs/" + idFr + "/receptions",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnDeleteFournisseurArticleAsso(idFr, idArt) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/articles/" +
          idArt,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnDeleteFournisseurCategorieAsso(idFr, idCat) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(
        this.SERVER_ADDRESS +
          "/reception/fournisseurs/" +
          idFr +
          "/categories/" +
          idCat,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur_article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
}
