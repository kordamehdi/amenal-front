import { Action } from "@ngrx/store";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";

export const GET_VISITEUR = "GET_VISITEUR";
export const GET_VISITEUR_ASSO_TO_PROJET = "GET_VISITEUR_ASSO_TO_PROJET";
export const GET_NAVIGATION_FICHE_POSITION = "GET_NAVIGATION_FICHE_POSITION";

export class getVisiteur implements Action {
  readonly type = GET_VISITEUR;
  payload: visiteurModel[];
  constructor(payload: visiteurModel[]) {
    this.payload = payload;
  }
}

export class getNavigationState implements Action {
  readonly type = GET_NAVIGATION_FICHE_POSITION;
  payload: {
    a: number;
    b: number;
    position: number;
  };
  constructor(payload) {
    this.payload = payload;
  }
}

export class getVisiteurAssoToProjet implements Action {
  readonly type = GET_VISITEUR_ASSO_TO_PROJET;
  payload: visiteurModel[];
  constructor(payload: visiteurModel[]) {
    this.payload = payload;
  }
}

export type FicheVisiteAction =
  | getVisiteur
  | getVisiteurAssoToProjet
  | getNavigationState;
