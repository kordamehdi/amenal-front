import { ProjetModel } from "../models/projet.model";
import * as fromProjetAction from "./projet.actions";
import { UtilisateurModel } from "../models/utilisateur.model";
import { AuthModel } from "../models/auth.model";

export interface projetState {
  projets: ProjetModel[];
  projetSelectionner: ProjetModel;
  isBlack: boolean;
  baseUrl: string;
  refreshComp: { refresh: string; f: boolean };
  users: UtilisateurModel[];
  usersWithRole: UtilisateurModel[];
  currentUser: AuthModel;
  loginError: { isErr: boolean; msg: string };
}

const InitialState: projetState = {
  projets: [],
  projetSelectionner: null,
  isBlack: false,
  baseUrl: "https://amenal-back.herokuapp.com",
  //baseUrl: "http://127.0.0.1:8080",
  refreshComp: { refresh: "", f: false },
  users: [],
  usersWithRole: [],
  currentUser: null,
  loginError: { isErr: false, msg: "" }
};

export function ProjetReducer(
  state = InitialState,
  action: fromProjetAction.ProjetAction
) {
  switch (action.type) {
    case fromProjetAction.LOGIN_ERROR: {
      return {
        ...state,
        loginError: { isErr: action.payload.isErr, msg: action.payload.msg }
      };
    }
    case fromProjetAction.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload
      };
    }
    case fromProjetAction.GET_USER_WITH_ROLE: {
      return {
        ...state,
        usersWithRole: action.payload
      };
    }
    case fromProjetAction.GET_USERS: {
      return {
        ...state,
        users: action.payload
      };
    }
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
    case fromProjetAction.REFRESH: {
      return {
        ...state,
        refreshComp: { refresh: action.payload, f: !state.refreshComp.f }
      };
    }
    default:
      return { ...state };
  }
}
