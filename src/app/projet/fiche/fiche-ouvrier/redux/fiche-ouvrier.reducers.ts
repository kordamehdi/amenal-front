import { OuvrierModel } from "./../../../models/ouvrier.model";
import * as fromFicheOuvrierAction from "./fiche-ouvrier.action";

export interface ficheOuvrierState {
  ouvriers: OuvrierModel[];
  ouvrierEditingId: number;
  ouvrierRemovingId: number;
  columnDesignation: String[];
  columnOuvrier: String[];
  qualifications: String[];
  showAlert: Boolean;
  errorMsg: string;
  AlertCtn: Boolean;
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
    "cin",
    "nom",
    "prenom",
    "qualification",
    "age",
    "ancienter",
    "J_TRV",
    "tele",
    "appreciation"
  ],
  qualifications: ["Macon", "Boiseur", "Ingenieur"],
  showAlert: false,
  AlertCtn: false,
  errorMsg: ""
};
export function OuvrierReducer(
  state = InitialState,
  action: fromFicheOuvrierAction.FicheAction
) {
  switch (action.type) {
    case fromFicheOuvrierAction.GET_OUVRIER: {
      return {
        ...state,
        ouvriers: action.payload
      };
    }
    case fromFicheOuvrierAction.SHOW_ALERT: {
      return {
        ...state,
        showAlert: action.payload.showAlert,
        errorMsg: action.payload.msg
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
        showAlert: true,
        errorMsg: "Vous Etes sure de vouloire supprimer cet ouvrier?",
        ouvrierRemovingId: action.payload
      };
    }
    case fromFicheOuvrierAction.FINISH_REMOVE_OUVRIER: {
      return {
        ...state,
        showAlert: false,
        errorMsg: "",
        ouvrierRemovingId: -1
      };
    }
    default:
      return { ...state };
  }
}
