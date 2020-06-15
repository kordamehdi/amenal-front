import { categorieModel } from "./../../../models/categorie.model";
import { Action } from "@ngrx/store";
import { FournisseurModel } from "src/app/projet/models/fournisseur-materiel.model";
import { fournisseurArticleModel } from "src/app/projet/models/fournisseur-article.model";
import { ReceptionCategorieModel } from "src/app/projet/models/reception-designation.model";

export const GET_GATEGORIES = "GET_GATEGORIES";
export const GET_FOURNISSEUR_ARTICLE_NON_ASSO =
  "GET_FOURNISSEUR_ARTICLE_NON_ASSO";
export const GET_FOURNISSEUR_ARTICLE_ASSO = "GET_FOURNISSEUR_ARTICLE_ASSO";

export const GET_FICHE_RECEPTION_DS = "GET_FICHE_RECEPTION_DS";

export const GET_FOURNISSEUR_ARTICLE_TO_SELECT =
  "GET_FOURNISSEUR_ARTICLE_TO_SELECT";

export class getGategories implements Action {
  readonly type = GET_GATEGORIES;
  payload: categorieModel[];
  constructor(payload: categorieModel[]) {
    this.payload = payload;
  }
}

export class getFournisseurArticleNonAsso implements Action {
  readonly type = GET_FOURNISSEUR_ARTICLE_NON_ASSO;
  payload: FournisseurModel[];
  constructor(payload: FournisseurModel[]) {
    this.payload = payload;
  }
}

export class getFournisseurArticleAsso implements Action {
  readonly type = GET_FOURNISSEUR_ARTICLE_ASSO;
  payload: fournisseurArticleModel[];
  constructor(payload: fournisseurArticleModel[]) {
    this.payload = payload;
  }
}
export class getFicheReceptionDs implements Action {
  readonly type = GET_FICHE_RECEPTION_DS;
  payload: ReceptionCategorieModel[];
  constructor(payload: ReceptionCategorieModel[]) {
    this.payload = payload;
  }
}

export class getfournisseurArticleToSelect implements Action {
  readonly type = GET_FOURNISSEUR_ARTICLE_TO_SELECT;
  payload: fournisseurArticleModel[];
  constructor(payload: fournisseurArticleModel[]) {
    this.payload = payload;
  }
}

export type FicheReceptionAction =
  | getGategories
  | getFournisseurArticleNonAsso
  | getFournisseurArticleAsso
  | getFicheReceptionDs
  | getfournisseurArticleToSelect;
