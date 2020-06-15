import {
  EntreeDesignationNonAssoModel,
  lotAssoModel,
  sousLotDesignationModel
} from "./../../../models/fiche-activite.model";
import { entreeNonAssoModel } from "./../../../models/lot.model";
import { Action } from "@ngrx/store";
import { lotModel } from "src/app/projet/models/lot.model";
export const ADD_LOT = "ADD_LOT";
export const GET_ENTREE_NON_ASSO = "GET_ENTREE_NON_ASSO";
export const GET_UNITE = "GET_UNITE";
export const GET_ENTREE_DESIGNATION_NON_ASSO_BY_SOUS_LOT =
  "GET_ENTREE_DESIGNATION_NON_ASSO_BY_SOUS_LOT";
export const GET_LOT_ASSO_TO_PROJET = "GET_LOT_ASSO_TO_PROJET";
export const GET_SOUS_LOT_ASSO_TO_PROJET = "GET_SOUS_LOT_ASSO_TO_PROJET";

export class getUnite implements Action {
  readonly type = GET_UNITE;
  payload: string[];
  constructor(payload: string[]) {
    this.payload = payload;
  }
}
export class addLot implements Action {
  readonly type = ADD_LOT;
  payload: lotModel[];
  constructor(payload: lotModel[]) {
    this.payload = payload;
  }
}
export class getEntreeNonAsso implements Action {
  readonly type = GET_ENTREE_NON_ASSO;
  payload: entreeNonAssoModel[];
  constructor(payload: entreeNonAssoModel[]) {
    this.payload = payload;
  }
}
export class getEntreeDesignationNonAssoBySousLot implements Action {
  readonly type = GET_ENTREE_DESIGNATION_NON_ASSO_BY_SOUS_LOT;
  payload: sousLotDesignationModel[];
  constructor(payload: sousLotDesignationModel[]) {
    this.payload = payload;
  }
}
export class getLotAssoToProjet implements Action {
  readonly type = GET_LOT_ASSO_TO_PROJET;
  payload: lotAssoModel[];
  constructor(payload: lotAssoModel[]) {
    this.payload = payload;
  }
}
export class getSousLotAssoToProjet implements Action {
  readonly type = GET_SOUS_LOT_ASSO_TO_PROJET;
  payload: lotAssoModel[];
  constructor(payload: lotAssoModel[]) {
    this.payload = payload;
  }
}

export type FicheActiviteAction =
  | addLot
  | getEntreeNonAsso
  | getUnite
  | getEntreeDesignationNonAssoBySousLot
  | getLotAssoToProjet
  | getSousLotAssoToProjet;
