import { UtilisateurModel } from "./../models/utilisateur.model";
import { OuvrierModel } from "./../models/ouvrier.model";
import { ProjetModel } from "../models/projet.model";
import { Action } from "@ngrx/store";
import { AuthModel } from "../models/auth.model";

export const ADD_PROJET = "ADD_PROJET";
export const GET_PROJETS = "GET_PROJETS";
export const SET_PROJETS = "SET_PROJETS";
export const SELECT_PROJET = "SELECT_PROJET";
export const SHOW_ALERT = "SHOW_ALERT";
export const CANCEL_ALERT = "CANCEL_ALERT";
export const IS_BLACK = "IS_BLACK";
export const REFRESH = "REFRESH";
export const GET_USERS = "GET_USERS";
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const GET_USER_WITH_ROLE = "GET_USER_WITH_ROLE";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const GET_INNER_HEIGHT = "GET_INNER_HEIGHT";
export class setCurrentUser implements Action {
  readonly type = SET_CURRENT_USER;
  payload: AuthModel;

  constructor(payload: AuthModel) {
    this.payload = payload;
  }
}

export class GetUsers implements Action {
  readonly type = GET_USERS;
  payload: UtilisateurModel[];

  constructor(payload: UtilisateurModel[]) {
    this.payload = payload;
  }
}
export class loginError implements Action {
  readonly type = LOGIN_ERROR;
  payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }
}

export class GetUsersWithRole implements Action {
  readonly type = GET_USER_WITH_ROLE;
  payload: UtilisateurModel[];

  constructor(payload: UtilisateurModel[]) {
    this.payload = payload;
  }
}

export class AddProjet implements Action {
  readonly type = ADD_PROJET;
  payload: ProjetModel;

  constructor(payload: ProjetModel) {
    this.payload = payload;
  }
}

export class GetProjets implements Action {
  readonly type = GET_PROJETS;
  constructor() {}
}

export class SetProjets implements Action {
  readonly type = SET_PROJETS;
  payload: ProjetModel[];

  constructor(payload: ProjetModel[]) {
    this.payload = payload;
  }
}

export class IsBlack implements Action {
  readonly type = IS_BLACK;
  payload: boolean;

  constructor(payload: boolean) {
    this.payload = payload;
  }
}
export class Refresh implements Action {
  readonly type = REFRESH;
  payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }
}
export class GetInnerHeight implements Action {
  readonly type = GET_INNER_HEIGHT;
  payload: number;

  constructor(payload: number) {
    this.payload = payload;
  }
}

export type ProjetAction =
  | AddProjet
  | GetProjets
  | SetProjets
  | IsBlack
  | Refresh
  | GetUsers
  | setCurrentUser
  | GetUsersWithRole
  | loginError
  | GetInnerHeight;
