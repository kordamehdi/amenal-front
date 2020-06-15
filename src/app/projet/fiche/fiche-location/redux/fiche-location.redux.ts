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
}

const initialState: ficheLocationState = {
  fournisseurs: [],
  materiels: [],
  showList: false,
  fournisseursByMateriel: [],
  fournisseurByProjet: [],
  unites: []
};

export function ficheLocationReducer(
  state = initialState,
  action: fromFicheLocationAction.FicheLocationAction
): ficheLocationState {
  switch (action.type) {
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
