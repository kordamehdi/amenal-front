import { besionModel } from "src/app/projet/models/besion.model";
import * as fromFicheBesoinAction from "../redux/besion.action";
export interface ficheBesionState {
  listBesion: besionModel[];
}

const InitialState: ficheBesionState = {
  listBesion: [
    {
      besoin: "bbbbbbbbbbb",
      unite: "H",
      id: 1,
      type: "c1"
    }
  ]
};
export function ProjetReducer(
  state = InitialState,
  action: fromFicheBesoinAction.ficheBesoinAction
) {
  switch (action.type) {
    case fromFicheBesoinAction.GET_LIST_BESOIN: {
      return {
        ...state,
        listBesion: action.payload
      };
    }
    default:
      return { ...state };
  }
}
