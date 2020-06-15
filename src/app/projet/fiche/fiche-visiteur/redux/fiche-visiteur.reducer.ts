import * as fromficheVisiteurAction from "./fiche-visiteur.action";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";

export interface ficheVisiteurState {
  visiteurs: visiteurModel[];
  visiteursAsso: visiteurModel[];
}

const initialState: ficheVisiteurState = {
  visiteurs: [],
  visiteursAsso: []
};

export function ficheVisiteurReducer(
  state = initialState,
  action: fromficheVisiteurAction.FicheVisiteAction
): ficheVisiteurState {
  switch (action.type) {
    case fromficheVisiteurAction.GET_VISITEUR: {
      return {
        ...state,
        visiteurs: action.payload
      };
    }
    case fromficheVisiteurAction.GET_VISITEUR_ASSO_TO_PROJET: {
      return {
        ...state,
        visiteursAsso: action.payload
      };
    }
    default:
      return { ...state };
  }
}
