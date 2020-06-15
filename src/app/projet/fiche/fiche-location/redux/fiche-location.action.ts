import { MaterielModel } from "./../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Action } from "@ngrx/store";
export const GET_FOURNISSEUR = "GET_FOURNISSEUR";
export const GET_MATERIEL = "GET_MATERIEL";
export const GET_UNITE = "GET_UNITE";

export const SHOW_LIST = "SHOW_LIST";
export const GET_FOURNISSEURS_BY_MATERIEL = "GET_FOURNISSEURS_BY_MATERIEL";
export const GET_FOURNISSEUR_BY_PROJET = "GET_FOURNISSEUR_BY_PROJET";

export class getFournisseur implements Action {
  readonly type = GET_FOURNISSEUR;
  payload: FournisseurModel[];
  constructor(payload: FournisseurModel[]) {
    this.payload = payload;
  }
}
export class getMateriel implements Action {
  readonly type = GET_MATERIEL;
  payload: MaterielModel[];
  constructor(payload: MaterielModel[]) {
    this.payload = payload;
  }
}
export class GetUnite implements Action {
  readonly type = GET_UNITE;
  payload: string[];
  constructor(payload: string[]) {
    this.payload = payload;
  }
}
export class showList implements Action {
  readonly type = SHOW_LIST;
  payload: boolean;
  constructor(payload: boolean) {
    this.payload = payload;
  }
}
export class getFournisseurByMaterielId implements Action {
  readonly type = GET_FOURNISSEURS_BY_MATERIEL;
  payload: FournisseurModel[];
  constructor(payload: FournisseurModel[]) {
    this.payload = payload;
  }
}
export class getFournisseurByProjet implements Action {
  readonly type = GET_FOURNISSEUR_BY_PROJET;
  payload: FournisseurModel[];
  constructor(payload: FournisseurModel[]) {
    this.payload = payload;
  }
}

export type FicheLocationAction =
  | getFournisseur
  | getMateriel
  | showList
  | getFournisseurByMaterielId
  | getFournisseurByProjet
  | GetUnite;
