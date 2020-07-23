import * as fileAction from "./fiche.action";
import { FicheModel } from "../../models/fiche.model";
import * as fromFicheAction from "./fiche.action";
import { ProjetModel } from "../../models/projet.model";
import * as moment from "moment";
export interface FicheList {
  ficheSelectionner: FicheModel;
  projetSelectionner: ProjetModel;
  typeSelectionner: any;
  dateSelectionner: any;
  DsRemovingId: Number;
  listerOuvrier: Boolean;
  showAlert: boolean;
  errorMsg: string;
  type: string;
  listAll: boolean;
  validerFiche: string;
}

const InitialState: FicheList = {
  ficheSelectionner: null,
  projetSelectionner: null,
  typeSelectionner: "",
  dateSelectionner: null,
  listerOuvrier: false,
  DsRemovingId: -1,
  showAlert: false,
  errorMsg: "",
  type: "",
  listAll: false,
  validerFiche: ""
};
export function FicheReducer(
  state = InitialState,
  action: fileAction.FicheAction
) {
  switch (action.type) {
    case fromFicheAction.RESET:
      return {
        ...InitialState
      };
    case fromFicheAction.SELECT_PROJET:
      return {
        ...InitialState,
        projetSelectionner: action.payload
      };
    case fromFicheAction.REFRESH_FICHE: {
      return {
        ...state,
        ficheSelectionner: action.payload,
        dateSelectionner: action.payload.date,
        typeSelectionner: action.payload.type
      };
    }

    case fromFicheAction.LISTER: {
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

    case fromFicheAction.SHOW_ALERT: {
      return {
        ...state,
        type: action.payload.type,
        showAlert: action.payload.showAlert,
        errorMsg: action.payload.msg
      };
    }
    case fromFicheAction.START_REMOVE_DS: {
      return {
        ...state,
        showAlert: true,
        errorMsg: "Vous Etes sure de vouloire supprimer cet designation?",
        DsRemovingId: action.payload,
        type: "fiche-ouvrier-ds"
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
        DsRemovingId: -1,
        type: "fiche-ouvrier-ds"
      };
    }
    case fromFicheAction.LIST_ALL: {
      return {
        ...state,
        listAll: action.payload
      };
    }
    default:
      return { ...state };
  }
}
