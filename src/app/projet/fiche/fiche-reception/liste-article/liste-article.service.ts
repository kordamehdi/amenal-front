import { fournisseurArticleModel } from "src/app/projet/models/fournisseur-article.model";
import { articleModel } from "./../../../models/article.model";
import { FicheModel } from "./../../../models/fiche.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as fromFicheAction from "../../redux/fiche.action";

import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { ProjetModel } from "src/app/projet/models/projet.model";
import { FournisseurArticleService } from "../fournisseur-article/fournisseur-article.service";
@Injectable()
export class ListeArticleService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;
  FicheSelectionner: FicheModel;
  type = "RECEPTION";
  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private fournisseurArticleService: FournisseurArticleService
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(ficheState => {
      this.projetSelectionner = ficheState.projetSelectionner;
      this.FicheSelectionner =
        ficheState.Fiches[ficheState.FicheSelectionnerPosition];
    });
  }

  OnAddCategorie(categorie) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<any>(
        this.SERVER_ADDRESS + "/articles/categories",
        {
          id: null,
          categorie: categorie
        },
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.OnGetCategorie();
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnAddArticle(article) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .post<articleModel>(this.SERVER_ADDRESS + "/articles", article, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.OnGetCategorie();
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  OnEditArticle(article, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<articleModel>(this.SERVER_ADDRESS + "/articles/" + id, article, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.OnGetCategorie();
          this.fournisseurArticleService.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnDeleteArticle(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<articleModel>(this.SERVER_ADDRESS + "/articles/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.OnGetCategorie();
          this.fournisseurArticleService.getFournisseurAsso();
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  OnGetCategorie() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .get<any>(this.SERVER_ADDRESS + "/articles/categories", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        gats => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheReceptionAction.getGategories(gats));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }

  OnEditCategorie(categorie, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS + "/articles/categories/" + id,
        {
          id: null,
          categorie: categorie
        },
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.OnGetCategorie();
          this.fournisseurArticleService.getFournisseurAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnDeleteCategorie(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/articles/categories/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.OnGetCategorie();
          this.fournisseurArticleService.getFournisseurAsso();
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
}
