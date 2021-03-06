import { ReceptionCategorieModel } from "./../../../models/reception-designation.model";
import { categorieModel } from "./../../../models/categorie.model";
import * as fromFicheReceptionAction from "./fiche-reception.action";
import { fournisseurArticleModel } from "src/app/projet/models/fournisseur-article.model";
import { FournisseurModel } from "src/app/projet/models/fournisseur-materiel.model";

export interface FicheReceptionState {
  ListRecState: {
    showDetails: [];
    sortState: any;
  };
  categories: categorieModel[];
  fournisseurArticleAsso: fournisseurArticleModel[];
  fournisseurArticleNonAsso: FournisseurModel[];

  ficheReceptionDs: ReceptionCategorieModel[];
  fournisseurArticleToSelect: fournisseurArticleModel[];
  showFournisseurByArticleOrCategorie: {
    itemId: number;
    itemType: string;
    itemName: string;
  };
  showArticleByFournisseurId: number;
  showDetails: [
    {
      id: number;
      show: boolean;
    }
  ];
}
const InitialState: FicheReceptionState = {
  ListRecState: {
    showDetails: [],
    sortState: [
      {
        name: "designation",
        asc: true,
        isFocus: false
      },
      {
        name: "fournisseurNom",
        asc: true,
        isFocus: false
      },
      {
        name: "brf",
        asc: true,
        isFocus: false
      }
    ]
  },
  showFournisseurByArticleOrCategorie: {
    itemId: -1,
    itemType: "",
    itemName: ""
  },
  showArticleByFournisseurId: -1,
  categories: [],
  fournisseurArticleAsso: [],
  fournisseurArticleNonAsso: [],
  ficheReceptionDs: [],
  fournisseurArticleToSelect: [],
  showDetails: [
    {
      id: 0,
      show: false
    }
  ]
};

export function FicheReducer(
  state = InitialState,
  action: fromFicheReceptionAction.FicheReceptionAction
) {
  switch (action.type) {
    case fromFicheReceptionAction.SHOW_DETAIL_LIST_REC: {
      return {
        ...state,
        ListRecState: action.payload
      };
    }
    case fromFicheReceptionAction.SHOW_DETAIL_CAT_ARTICLE: {
      return {
        ...state,
        showDetails: action.payload
      };
    }
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
