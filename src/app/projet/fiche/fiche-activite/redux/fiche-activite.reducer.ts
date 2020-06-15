import {
  EntreeDesignationNonAssoModel,
  lotAssoModel,
  sousLotDesignationModel
} from "./../../../models/fiche-activite.model";
import { lotModel, entreeNonAssoModel } from "./../../../models/lot.model";
import * as fromFicheActiviteAction from "./fiche-activite.action";

export interface FicheActiviteState {
  lots: lotModel[];
  entreeNonAsso: entreeNonAssoModel[];
  entreeDesignationNonAssoBySousLot: sousLotDesignationModel[];
  unites: string[];
  lotAssoToProjet: lotAssoModel[];
  souLotWithLotAssoToProjet: lotAssoModel[];
}
const InitialState: FicheActiviteState = {
  lots: [],
  entreeNonAsso: [],
  unites: [],
  entreeDesignationNonAssoBySousLot: [],
  lotAssoToProjet: [],
  souLotWithLotAssoToProjet: []
};

export function FicheActiviteReducer(
  state = InitialState,
  action: fromFicheActiviteAction.FicheActiviteAction
): FicheActiviteState {
  switch (action.type) {
    case fromFicheActiviteAction.GET_SOUS_LOT_ASSO_TO_PROJET: {
      return {
        ...state,
        souLotWithLotAssoToProjet: action.payload
      };
    }
    case fromFicheActiviteAction.GET_UNITE: {
      return {
        ...state,
        unites: action.payload
      };
    }
    case fromFicheActiviteAction.ADD_LOT: {
      return {
        ...state,
        lots: action.payload
      };
    }
    case fromFicheActiviteAction.GET_ENTREE_NON_ASSO: {
      return {
        ...state,
        entreeNonAsso: action.payload
      };
    }
    case fromFicheActiviteAction.GET_ENTREE_DESIGNATION_NON_ASSO_BY_SOUS_LOT: {
      return {
        ...state,
        entreeDesignationNonAssoBySousLot: action.payload
      };
    }
    case fromFicheActiviteAction.GET_LOT_ASSO_TO_PROJET: {
      return {
        ...state,
        lotAssoToProjet: action.payload
      };
    }
    default:
      return { ...state };
  }
}
