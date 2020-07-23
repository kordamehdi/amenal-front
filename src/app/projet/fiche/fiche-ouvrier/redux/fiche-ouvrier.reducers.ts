import { ficheOuvrierState } from "./fiche-ouvrier.reducers";
import { OuvrierModel } from "./../../../models/ouvrier.model";
import * as fromFicheOuvrierAction from "./fiche-ouvrier.action";
import { reduce } from "rxjs/operators";

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
  ficheState: {
    position: {
      a: number;
      b: number;
      position: number;
    };
    filter: {
      nom: string;
      qualification: string;
    };
    sort: boolean;
  };
  ouvListState: {
    position: {
      a: number;
      b: number;
      position: number;
    };
    filter: {
      cin: string;
      nom: string;
      prenom: string;
      qualification: string;
      appreciation: string;
    };
    sort: {
      order: {
        cin: boolean;
        nom: boolean;
        prenom: boolean;
        qualification: boolean;
        appreciation: boolean;
      };
      type: string;
    };
  };
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
  isOuvrierUpdate: -1,
  ficheState: {
    position: {
      a: 0,
      b: 2,
      position: 1
    },
    filter: {
      nom: "",
      qualification: ""
    },
    sort: true
  },
  ouvListState: {
    position: {
      a: 0,
      b: 3,
      position: 1
    },
    filter: {
      cin: "",
      nom: "",
      prenom: "",
      qualification: "",
      appreciation: ""
    },
    sort: {
      order: {
        cin: true,
        nom: true,
        prenom: true,
        qualification: true,
        appreciation: true
      },
      type: ""
    }
  }
};

export function OuvrierReducer(
  state = InitialState,
  action: fromFicheOuvrierAction.FicheAction
): ficheOuvrierState {
  switch (action.type) {
    case fromFicheOuvrierAction.GET_OUV_LIST_STATE: {
      return {
        ...state,
        ouvListState: action.payload
      };
    }
    case fromFicheOuvrierAction.GET_FICHE_STATE: {
      return {
        ...state,
        ficheState: action.payload
      };
    }
    case fromFicheOuvrierAction.GET_FICHE_STATE: {
      return {
        ...state,
        ficheState: action.payload
      };
    }
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
