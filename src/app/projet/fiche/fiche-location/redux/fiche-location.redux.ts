import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import { MaterielModel } from "./../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import * as fromFicheLocationAction from "./fiche-location.action";

export interface ficheLocationState {
  fournisseurs: FournisseurModel[];
  materiels: MaterielModel[];
  showList: Boolean;
  fournisseursByMateriel: FournisseurModel[];
  fournisseurByProjet: FournisseurModel[];
  unites: string[];
  showMaterielByFournisseur: {
    materiels: MaterielModel[];
    fournisseurNom: string;
    fournisseurId: number;
  };

  showFournisseurByMateriel: {
    materielId: number;
    materielNom: string;
  };
  fourFilterKeyWord: string;
  MaterielFilterKeyWord: string;

  fournisseurMaterielNotAsso: FournisseurModel[];
  ficheLocState: {
    filter: {
      libelle: string;
      fournisseurNom: string;
      brf: string;
    };

    sort: {
      order: any;
      type: string;
    };
  };
}

const initialState: ficheLocationState = {
  showMaterielByFournisseur: {
    fournisseurNom: "",
    materiels: [],
    fournisseurId: -1
  },
  showFournisseurByMateriel: {
    materielId: -1,
    materielNom: ""
  },
  fourFilterKeyWord: "",
  MaterielFilterKeyWord: "",
  fournisseurs: [],
  materiels: [],
  showList: false,
  fournisseursByMateriel: [],
  fournisseurByProjet: [],
  unites: [],
  fournisseurMaterielNotAsso: [],
  ficheLocState: {
    filter: {
      libelle: "",
      fournisseurNom: "",
      brf: ""
    },
    sort: {
      order: [
        {
          type: "libelle",
          order: true,
          isFocus: true
        },
        {
          type: "tempsFin",
          order: true,
          isFocus: false
        },
        {
          type: "tempsDebut",
          order: true,
          isFocus: false
        },
        {
          type: "travailleLoc",
          order: true,
          isFocus: false
        },
        {
          type: "fournisseurNom",
          order: true,
          isFocus: false
        },
        {
          type: "brf",
          order: true,
          isFocus: false
        }
      ],
      type: "libelle"
    }
  }
};

export function ficheLocationReducer(
  state = initialState,
  action: fromFicheLocationAction.FicheLocationAction
): ficheLocationState {
  switch (action.type) {
    case fromFicheLocationAction.GET_MAT_FILTER_KEY_WORD: {
      return {
        ...state,
        MaterielFilterKeyWord: action.payload
      };
    }
    case fromFicheLocationAction.GET_FOUR_FILTER_KEY_WORD: {
      return {
        ...state,
        fourFilterKeyWord: action.payload
      };
    }
    case fromFicheLocationAction.GET_FICHE_LOC_STATE: {
      return {
        ...state,
        ficheLocState: action.payload
      };
    }
    case fromFicheLocationAction.GET_FOURNISSEUR_LOCATION_NOT_ASSO: {
      return {
        ...state,
        fournisseurMaterielNotAsso: action.payload
      };
    }
    case fromFicheLocationAction.GET_FOURNISSEUR_LOCATION_NOT_ASSO: {
      return {
        ...state,
        fournisseurMaterielNotAsso: action.payload
      };
    }
    case fromFicheLocationAction.SHOW_FOURNISSEUR_BY_MATERIEL: {
      return {
        ...state,
        showFournisseurByMateriel: action.payload
      };
    }
    case fromFicheLocationAction.SHOW_MATERIEL_BY_FOURNISSEUR: {
      return {
        ...state,
        showMaterielByFournisseur: action.payload
      };
    }
    case fromFicheLocationAction.GET_FOURNISSEUR: {
      return {
        ...state,
        fournisseurs: action.payload
      };
    }
    case fromFicheLocationAction.GET_MATERIEL: {
      return {
        ...state,
        materiels: action.payload
      };
    }
    case fromFicheLocationAction.GET_UNITE: {
      return {
        ...state,
        unites: action.payload
      };
    }
    case fromFicheLocationAction.SHOW_LIST: {
      return {
        ...state,
        showList: action.payload
      };
    }

    case fromFicheLocationAction.GET_FOURNISSEURS_BY_MATERIEL: {
      return {
        ...state,
        fournisseursByMateriel: action.payload
      };
    }
    case fromFicheLocationAction.GET_FOURNISSEUR_BY_PROJET: {
      return {
        ...state,
        fournisseurByProjet: action.payload
      };
    }
    default: {
      return { ...state };
    }
  }
}
