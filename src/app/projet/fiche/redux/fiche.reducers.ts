import * as fileAction from "./fiche.action";
import { FicheModel } from "../../models/fiche.model";
import * as fromFicheAction from "./fiche.action";
import { ProjetModel } from "../../models/projet.model";

export interface FicheList {
  Fiches: FicheModel[];
  FicheSelectionnerPosition: number;
  projetSelectionner: ProjetModel;
  typeSelectionner: String;
  dateSelectionner: any;
  DsRemovingId: Number;
  listerOuvrier: Boolean;
  showAlert: boolean;
  errorMsg: string;
  validerFiche: boolean;
}

const InitialState: FicheList = {
  Fiches: [],
  projetSelectionner: null,
  typeSelectionner: "tous",
  dateSelectionner: "2020-02-20",
  listerOuvrier: false,
  DsRemovingId: -1,
  FicheSelectionnerPosition: 0,
  showAlert: false,
  errorMsg: "",
  validerFiche: false
};
export function FicheReducer(
  state = InitialState,
  action: fileAction.FicheAction
) {
  switch (action.type) {
    case fromFicheAction.SELECT_PROJET:
      return {
        ...state,
        projetSelectionner: action.payload
      };
    case fromFicheAction.SELECT_FICHE_TYPE: {
      return {
        ...state,
        typeSelectionner: action.payload
      };
    }
    case fromFicheAction.LISTER_OUVRIER: {
      return {
        ...state,
        listerOuvrier: action.payload
      };
    }
    case fromFicheAction.GET_OUVRIER_BY_PROJET: {
      let projet = { ...state.projetSelectionner };
      projet.ouvriers = action.payload;
      return {
        ...state,
        projetSelectionner: projet
      };
    }
    case fromFicheAction.SET_FICHES: {
      return {
        ...state,
        Fiches: action.payload
      };
    }
    case fromFicheAction.NEXT_FICHE: {
      console.log("next next");
      let next = { ...state }.FicheSelectionnerPosition;
      next = next + 1;

      return {
        ...state,
        FicheSelectionnerPosition: next
      };
    }
    case fromFicheAction.PREVIOUS_FICHE: {
      let previous = { ...state }.FicheSelectionnerPosition;
      previous = previous - 1;

      return {
        ...state,
        FicheSelectionnerPosition: previous
      };
    }
    case fromFicheAction.SHOW_ALERT: {
      return {
        ...state,
        hasError: action.payload.showAlert,
        errorMsg: action.payload.msg
      };
    }
    case fromFicheAction.START_REMOVE_DS: {
      return {
        ...state,
        showAlert: true,
        errorMsg: "Vous Etes sure de vouloire supprimer cet designation?",
        DsRemovingId: action.payload
      };
    }
    case fromFicheAction.VALIDER_FICHE: {
      return {
        ...state,
        validerFiche: action.payload
      };
    }
    case fromFicheAction.FINISH_REMOVE_DS: {
      return {
        ...state,
        showAlert: false,
        errorMsg: "",
        DsRemovingId: -1
      };
    }
    default:
      return { ...state };
  }
}
