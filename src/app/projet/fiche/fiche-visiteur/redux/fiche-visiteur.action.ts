import { Action } from "@ngrx/store";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";

export const GET_VISITEUR = "GET_VISITEUR";
export const GET_VISITEUR_ASSO_TO_PROJET = "GET_VISITEUR_ASSO_TO_PROJET";

export class getVisiteur implements Action {
  readonly type = GET_VISITEUR;
  payload: visiteurModel[];
  constructor(payload: visiteurModel[]) {
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

export type FicheVisiteAction = getVisiteur | getVisiteurAssoToProjet;
