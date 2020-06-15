import * as fromficheDocumentAction from "./fiche-document.action";
import { documentModel } from "src/app/projet/models/fiche-document.model";
export interface ficheDocumentState {
  documents: documentModel[];
  documentsAsso: documentModel[];
}

const initialState: ficheDocumentState = {
  documents: [],
  documentsAsso: []
};

export function ficheDocumentReducer(
  state = initialState,
  action: fromficheDocumentAction.FicheDocumentAction
): ficheDocumentState {
  switch (action.type) {
    case fromficheDocumentAction.GET_DOCUMENT: {
      return {
        ...state,
        documents: action.payload
      };
    }
    default:
      return { ...state };
  }
}
