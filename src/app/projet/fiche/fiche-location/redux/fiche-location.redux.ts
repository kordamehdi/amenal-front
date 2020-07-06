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
  fournisseurMaterielNotAsso: FournisseurModel[];
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
  fournisseurs: [],
  materiels: [],
  showList: false,
  fournisseursByMateriel: [],
  fournisseurByProjet: [],
  unites: [],
  fournisseurMaterielNotAsso: []
};

export function ficheLocationReducer(
  state = initialState,
  action: fromFicheLocationAction.FicheLocationAction
): ficheLocationState {
  switch (action.type) {
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
