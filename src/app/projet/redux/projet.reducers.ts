import { ProjetModel } from "../models/projet.model";
import * as fromProjetAction from "./projet.actions";

export interface projetState {
  projets: ProjetModel[];
  projetSelectionner: ProjetModel;
  isBlack: boolean;
}

const InitialState: projetState = {
  projets: [
    {
      id: 1,
      titre: "rien",
      fichierTypes: [],
      ouvriers: []
    }
  ],
  projetSelectionner: null,
  isBlack: false
};

export function ProjetReducer(
  state = InitialState,
  action: fromProjetAction.ProjetAction
) {
  switch (action.type) {
    case fromProjetAction.SET_PROJETS:
      return {
        ...state,
        projets: action.payload
      };

    case fromProjetAction.IS_BLACK: {
      return {
        ...state,
        isBlack: action.payload
      };
    }
    default:
      return { ...state };
  }
}
