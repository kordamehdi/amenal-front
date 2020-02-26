import { OuvrierModel } from "./../models/ouvrier.model";
import { ProjetModel } from "../models/projet.model";
import { Action } from "@ngrx/store";

export const ADD_PROJET = "ADD_PROJET";
export const GET_PROJETS = "GET_PROJETS";
export const SET_PROJETS = "SET_PROJETS";
export const SELECT_PROJET = "SELECT_PROJET";
export const SHOW_ALERT = "SHOW_ALERT";
export const CANCEL_ALERT = "CANCEL_ALERT";
export const IS_BLACK = "IS_BLACK";

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

export type ProjetAction = AddProjet | GetProjets | SetProjets | IsBlack;
