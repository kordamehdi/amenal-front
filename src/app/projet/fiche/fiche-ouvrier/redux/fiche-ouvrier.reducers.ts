import { OuvrierModel } from "./../../../models/ouvrier.model";
import * as fromFicheOuvrierAction from "./fiche-ouvrier.action";

export interface ficheOuvrierState {
  ouvriers: OuvrierModel[];
  ouvrierEditingId: number;
  ouvrierRemovingId: number;
  columnDesignation: String[];
  columnOuvrier: String[];
  qualifications: String[];
  showOuvAlert: Boolean;
  errorOuvMsg: string;
  typeOuvDialog: string;
  AlertCtn: Boolean;
  isOuvrierUpdate: number;
}

const InitialState: ficheOuvrierState = {
  ouvriers: null,
  ouvrierEditingId: -1,
  ouvrierRemovingId: -1,
  columnDesignation: [
    "NOM & PRENOM",
    "CIN",
    "QUALIFICATION",
    "DEBUT",
    "FIN",
    "TRAVAIL",
    "JOUR",
    "H.SUP",
    "EPI"
  ],
  columnOuvrier: [
    "appreciation",
    "tele",
    "J_TRV",
    "ancienter",
    "age",
    "qual",
    "prenom",
    "nom",
    "cin"
  ],
  qualifications: [],
  showOuvAlert: false,
  AlertCtn: false,
  errorOuvMsg: "",
  typeOuvDialog: "",
  isOuvrierUpdate: -1
};
export function OuvrierReducer(
  state = InitialState,
  action: fromFicheOuvrierAction.FicheAction
) {
  switch (action.type) {
    case fromFicheOuvrierAction.IS_UPDATE: {
      return {
        ...state,
        isOuvrierUpdate: action.payload
      };
    }
    case fromFicheOuvrierAction.GET_OUVRIER: {
      return {
        ...state,
        ouvriers: action.payload
      };
    }
    case fromFicheOuvrierAction.GET_DESIGNATIONS: {
      return {
        ...state,
        qualifications: action.payload
      };
    }
    case fromFicheOuvrierAction.SHOW_ALERT_OUVRIER: {
      return {
        ...state,
        showOuvAlert: action.payload.showAlert,
        errorOuvMsg: action.payload.msg,
        typeOuvDialog: action.payload.typeDialog
      };
    }
    case fromFicheOuvrierAction.ALERT_YES: {
      return {
        ...state,
        AlertCtn: true
      };
    }
    case fromFicheOuvrierAction.START_REMOVE_OUVRIER: {
      return {
        ...state,
        showOuvAlert: true,
        errorOuvMsg: "Vous Etes sure de vouloire supprimer cet ouvrier?",
        typeOuvDialog: "fiche-ouvrier",
        ouvrierRemovingId: action.payload
      };
    }
    case fromFicheOuvrierAction.FINISH_REMOVE_OUVRIER: {
      return {
        ...state,
        showOuvAlert: false,
        errorOuvMsg: "",
        ouvrierRemovingId: -1,
        typeOuvDialog: "fiche-ouvrier"
      };
    }
    default:
      return { ...state };
  }
}
