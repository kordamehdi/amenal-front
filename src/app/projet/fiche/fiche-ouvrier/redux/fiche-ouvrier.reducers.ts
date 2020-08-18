import { ficheOuvrierState } from "./fiche-ouvrier.reducers";
import { OuvrierModel } from "./../../../models/ouvrier.model";
import * as fromFicheOuvrierAction from "./fiche-ouvrier.action";
import { reduce } from "rxjs/operators";

export interface ficheOuvrierState {
  ouvriers: OuvrierModel[];
  ouvrierEditingId: number;
  ouvrierRemovingId: number;
  columnDesignation: String[];
  qualifications: String[];
  villes: string[];
  appreciations: string[];
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
    sort: any;
  };
  ouvListState: {
    filter: {
      cin: string;
      nom: string;
      prenom: string;
      qualification: string;
      appreciation: string;
    };
    sort: any;
  };
  villeAded: boolean;
}

const InitialState: ficheOuvrierState = {
  ouvriers: null,
  ouvrierEditingId: -1,
  ouvrierRemovingId: -1,
  villes: ["AGADIR"],
  appreciations: ["AAA"],

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
    sort: {
      order: [
        {
          type: "nom",
          order: true,
          isFocus: true
        },
        {
          type: "qualification",
          order: true,
          isFocus: false
        },
        {
          type: "tempsDebut",
          order: true,
          isFocus: false
        },
        {
          type: "tempsFin",
          order: true,
          isFocus: false
        },
        {
          type: "tempsDiff",
          order: true,
          isFocus: false
        },
        {
          type: "hsup",
          order: true,
          isFocus: false
        },
        {
          type: "jour",
          order: true,
          isFocus: false
        }
      ],
      type: "nom"
    }
  },
  ouvListState: {
    filter: {
      cin: "",
      nom: "",
      prenom: "",
      qualification: "",
      appreciation: ""
    },
    sort: {
      order: [
        {
          type: "cin",
          order: true,
          isFocus: false
        },
        {
          type: "nom",
          order: true,
          isFocus: false
        },
        {
          type: "prenom",
          order: true,
          isFocus: false
        },
        {
          type: "ville",
          order: true,
          isFocus: false
        },
        {
          type: "qualification",
          order: true,
          isFocus: false
        },
        {
          type: "appreciation",
          order: true,
          isFocus: false
        },
        {
          type: "dateNaissance",
          order: true,
          isFocus: false
        },
        {
          type: "dateRecrutement",
          order: true,
          isFocus: false
        }
      ],

      type: "nom"
    }
  },
  villeAded: false
};

export function OuvrierReducer(
  state = InitialState,
  action: fromFicheOuvrierAction.FicheAction
): ficheOuvrierState {
  switch (action.type) {
    case fromFicheOuvrierAction.VILLE_ADED: {
      return {
        ...state,
        villeAded: !state.villeAded
      };
    }
    case fromFicheOuvrierAction.GET_VILLE: {
      return {
        ...state,
        villes: action.payload
      };
    }
    case fromFicheOuvrierAction.GET_APPRREC: {
      return {
        ...state,
        appreciations: action.payload
      };
    }
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
