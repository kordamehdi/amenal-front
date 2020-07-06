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
  showFournisseurByArticleOrCategorie: {
    itemId: number;
    itemType: string;
  };
  showArticleByFournisseurId: number;
}
const InitialState: FicheReceptionState = {
  showFournisseurByArticleOrCategorie: {
    itemId: -1,
    itemType: ""
  },
  showArticleByFournisseurId: -1,
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
    case fromFicheReceptionAction.SHOW_FOURNISSEUR_BY_ARTICLE_OR_CATEGORIE: {
      return {
        ...state,
        showFournisseurByArticleOrCategorie: action.payload
      };
    }
    case fromFicheReceptionAction.SHOW_ARTICLE_BY_FOURNISSEUR: {
      return {
        ...state,
        showArticleByFournisseurId: action.payload
      };
    }
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
