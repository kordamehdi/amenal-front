import * as fileAction from "./fiche.action";
import { FicheModel } from "../../models/fiche.model";
import * as fromFicheAction from "./fiche.action";
import { ProjetModel } from "../../models/projet.model";
import * as moment from "moment";
export interface FicheList {
  Fiches: FicheModel[];
  FicheSelectionnerPosition: number;
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
  maxDate: any;
  minDate: any;
}

const InitialState: FicheList = {
  Fiches: [],
  projetSelectionner: null,
  typeSelectionner: "",
  dateSelectionner: null,
  listerOuvrier: false,
  DsRemovingId: -1,
  FicheSelectionnerPosition: 0,
  showAlert: false,
  errorMsg: "",
  type: "",
  listAll: false,
  validerFiche: "",
  maxDate: null,
  minDate: null
};
export function FicheReducer(
  state = InitialState,
  action: fileAction.FicheAction
) {
  switch (action.type) {
    case fromFicheAction.FILTER_BY_DATE: {
      let position = { ...state }.Fiches.findIndex(f => {
        return f.date === action.payload && f.type === state.typeSelectionner;
      });

      return {
        ...state,
        FicheSelectionnerPosition: position,
        dateSelectionner: action.payload
      };
    }
    case fromFicheAction.NEXT_DAY_FICHE: {
      if (state.dateSelectionner === state.maxDate) {
        return { ...state };
      } else {
        let nextDay = moment(state.dateSelectionner, "YYYY-MM-DD")
          .add("days", 1)
          .format("YYYY-MM-DD");
        let position = { ...state }.Fiches.findIndex(f => {
          return f.date === nextDay && f.type === state.typeSelectionner;
        });

        return {
          ...state,
          FicheSelectionnerPosition: position,
          dateSelectionner: nextDay
        };
      }
    }
    case fromFicheAction.PREVIOUS_DAY_FICHE: {
      if (state.dateSelectionner === state.minDate) {
        return { ...state };
      } else {
        let nextDay = moment(state.dateSelectionner, "YYYY-MM-DD")
          .subtract("days", 1)

          .format("YYYY-MM-DD");

        let position = { ...state }.Fiches.findIndex(f => {
          return f.date === nextDay && f.type === state.typeSelectionner;
        });

        return {
          ...state,
          FicheSelectionnerPosition: position,
          dateSelectionner: nextDay
        };
      }
    }
    case fromFicheAction.SELECT_PROJET:
      return {
        ...InitialState,
        projetSelectionner: action.payload
      };
    case fromFicheAction.REFRESH_FICHE: {
      let newFiche = action.payload.fiche;

      let FicheList = { ...state }.Fiches;

      let index = FicheList.findIndex(f => f.id === newFiche.id);

      FicheList[index] = newFiche;
      return {
        ...state,
        Fiches: FicheList
      };
    }
    case fromFicheAction.SELECT_FICHE_TYPE: {
      let position = action.payload.fiches.length - 1;
      if (state.dateSelectionner !== null)
        position = action.payload.fiches.findIndex(
          f => f.date === state.dateSelectionner
        );
      return {
        ...state,
        Fiches: action.payload.fiches,
        typeSelectionner: action.payload.type,
        FicheSelectionnerPosition: position,
        dateSelectionner: action.payload.fiches[position].date,
        maxDate: action.payload.fiches[action.payload.fiches.length - 1].date,
        minDate: action.payload.fiches[0].date
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
    case fromFicheAction.SET_FICHES: {
      let position = state.FicheSelectionnerPosition;
      if (state.dateSelectionner === null) position = action.payload.length - 1;
      return {
        ...state,
        Fiches: action.payload,
        FicheSelectionnerPosition: position,
        typeSelectionner: action.payload[position].type,
        maxDate: action.payload[action.payload.length - 1].date,
        minDate: action.payload[0].date
      };
    }
    case fromFicheAction.NEXT_FICHE: {
      let next = { ...state }.FicheSelectionnerPosition;

      if (next === state.Fiches.length - 1)
        return {
          ...state
        };
      else {
        next = next + 1;

        return {
          ...state,
          FicheSelectionnerPosition: next,
          typeSelectionner: state.Fiches[next].type,
          dateSelectionner: state.Fiches[next].date
        };
      }
    }
    case fromFicheAction.SET_FICHE_POSITION: {
      return {
        ...state,
        FicheSelectionnerPosition: action.payload,
        typeSelectionner: state.Fiches[action.payload].type,
        dateSelectionner: state.Fiches[action.payload].date
      };
    }
    case fromFicheAction.PREVIOUS_FICHE: {
      let previous = { ...state }.FicheSelectionnerPosition;
      if (previous === 0)
        return {
          ...state
        };
      else {
        previous = previous - 1;
        return {
          ...state,
          FicheSelectionnerPosition: previous,
          typeSelectionner: state.Fiches[previous].type,
          dateSelectionner: state.Fiches[previous].date
        };
      }
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
