import * as fromficheVisiteurAction from "./fiche-visiteur.action";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";

export interface ficheVisiteurState {
  visiteurs: visiteurModel[];
  visiteursAsso: visiteurModel[];
  positionFiche: {
    a: number;
    b: number;
    position: number;
  };
}

const initialState: ficheVisiteurState = {
  visiteurs: [],
  visiteursAsso: [],
  positionFiche: {
    a: 0,
    b: 2,
    position: 1
  }
};

export function ficheVisiteurReducer(
  state = initialState,
  action: fromficheVisiteurAction.FicheVisiteAction
): ficheVisiteurState {
  switch (action.type) {
    case fromficheVisiteurAction.GET_NAVIGATION_FICHE_POSITION: {
      return {
        ...state,
        positionFiche: action.payload
      };
    }
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
