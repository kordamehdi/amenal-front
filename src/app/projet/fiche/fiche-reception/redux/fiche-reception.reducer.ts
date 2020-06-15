import { ReceptionCategorieModel } from "./../../../models/reception-designation.model";
import { categorieModel } from "./../../../models/categorie.model";
import * as fromFicheReceptionAction from "./fiche-reception.action";
import { fournisseurArticleModel } from "src/app/projet/models/fournisseur-article.model";
import { FournisseurModel } from "src/app/projet/models/fournisseur-materiel.model";

export interface FicheReceptionState {
  categories: categorieModel[];
  fournisseurArticleAsso: fournisseurArticleModel[];
  fournisseurArticleNonAsso: FournisseurModel[];
  ficheReceptionDs: ReceptionCategorieModel[];
  fournisseurArticleToSelect: fournisseurArticleModel[];
}
const InitialState: FicheReceptionState = {
  categories: [],
  fournisseurArticleAsso: [],
  fournisseurArticleNonAsso: [],
  ficheReceptionDs: [],
  fournisseurArticleToSelect: []
};

export function FicheReducer(
  state = InitialState,
  action: fromFicheReceptionAction.FicheReceptionAction
) {
  switch (action.type) {
    case fromFicheReceptionAction.GET_GATEGORIES: {
      return {
        ...state,
        categories: action.payload
      };
    }
    case fromFicheReceptionAction.GET_FOURNISSEUR_ARTICLE_NON_ASSO: {
      return {
        ...state,
        fournisseurArticleNonAsso: action.payload
      };
    }
    case fromFicheReceptionAction.GET_FOURNISSEUR_ARTICLE_ASSO: {
      return {
        ...state,
        fournisseurArticleAsso: action.payload
      };
    }

    case fromFicheReceptionAction.GET_FOURNISSEUR_ARTICLE_TO_SELECT: {
      return {
        ...state,
        fournisseurArticleToSelect: action.payload
      };
    }

    default:
      return { ...state };
  }
}
