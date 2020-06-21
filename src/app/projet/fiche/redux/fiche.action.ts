import { FicheModel } from "./../../models/fiche.model";
import { Action } from "@ngrx/store";
import { ProjetModel } from "../../models/projet.model";
import { OuvrierModel } from "../../models/ouvrier.model";

export const SEARCH_BY_DATE = "SEARCH-BY-DATE";
export const SEARCH_BY_DATE_DONE = "SEARCH_BY_DATE_DONE";
export const SELECT_FICHE_TYPE = "SELECT_FICHE_TYPE";
export const REFRESH_FICHE = "REFRESH_FICHE";

export const LISTER = "LISTER";
export const SELECT_PROJET = "SELECT_PROJET";
export const SET_FICHES = "SET_FICHES";
export const PREVIOUS_FICHE = "PREVIOUS_FICHE";
export const NEXT_FICHE = "NEXT_FICHE";
export const SET_FICHE_POSITION = "SET_FICHE_POSITION";

export const GET_OUVRIER_BY_PROJET = "GET_OUVRIER_BY_PROJET";
export const SHOW_ALERT = "SHOW_ALERT";
export const START_REMOVE_DS = "START_REMOVE_DS";
export const FINISH_REMOVE_DS = "FINISH_REMOVE_DS";
export const VALIDER_FICHE = "VALIDER_FICHE";
export const LIST_ALL = "LIST_ALL";

export const PREVIOUS_DAY_FICHE = "PREVIOUS_DAY_FICHE";
export const NEXT_DAY_FICHE = "NEXT_DAY_FICHE";

export const FILTER_BY_DATE = "FILTER_BY_DATE";

export class SetFichePosition implements Action {
  readonly type = SET_FICHE_POSITION;
  payload: any;
  constructor(payload) {
    this.payload = payload;
  }
}

export class SearchByDateAction implements Action {
  readonly type = SEARCH_BY_DATE;
  payload: any;
  constructor(payload) {
    this.payload = payload;
  }
}
export class SearchByDateActionDone implements Action {
  readonly type = SEARCH_BY_DATE_DONE;
  constructor() {}
}
export class SelectFicheType implements Action {
  readonly type = SELECT_FICHE_TYPE;
  payload: { fiches: FicheModel[]; type: String };
  constructor(payload) {
    this.payload = payload;
  }
}
export class RefreshFiche implements Action {
  readonly type = REFRESH_FICHE;
  payload: FicheModel;
  constructor(payload) {
    this.payload = payload;
  }
}
export class Lister implements Action {
  readonly type = LISTER;
  payload: Boolean;
  constructor(payload: Boolean) {
    this.payload = payload;
  }
}
export class setFiches implements Action {
  readonly type = SET_FICHES;
  payload: FicheModel[];
  constructor(payload: FicheModel[]) {
    this.payload = payload;
  }
}
export class SelectProjet implements Action {
  readonly type = SELECT_PROJET;
  payload: ProjetModel;

  constructor(payload: ProjetModel) {
    this.payload = payload;
  }
}
export class GetOuvrierByProjet implements Action {
  readonly type = GET_OUVRIER_BY_PROJET;
  payload: OuvrierModel[];
  constructor(payload: OuvrierModel[]) {
    this.payload = payload;
  }
}

export class ValiderFiche implements Action {
  readonly type = VALIDER_FICHE;
  payload: any;
  constructor(payload: any) {
    this.payload = payload;
  }
}
export class ShowFicheAlert implements Action {
  readonly type = SHOW_ALERT;
  payload: {
    type: string;
    showAlert: boolean;
    msg: string;
  };

  constructor(payload) {
    this.payload = payload;
  }
}
export class StartRemovingDs implements Action {
  readonly type = START_REMOVE_DS;
  payload: number;
  constructor(payload: number) {
    this.payload = payload;
  }
}
export class FinishRemovingDs implements Action {
  readonly type = FINISH_REMOVE_DS;
  constructor() {}
}
export class listAll implements Action {
  readonly type = LIST_ALL;
  payload: boolean;
  constructor(payload) {
    this.payload = payload;
  }
}

export class filterByDate implements Action {
  readonly type = FILTER_BY_DATE;
  payload: any;
  constructor(payload) {
    this.payload = payload;
  }
}
export type FicheAction =
  | SearchByDateAction
  | SearchByDateActionDone
  | SelectFicheType
  | Lister
  | SelectProjet
  | setFiches
  | GetOuvrierByProjet
  | ShowFicheAlert
  | StartRemovingDs
  | FinishRemovingDs
  | ValiderFiche
  | SetFichePosition
  | listAll
  | filterByDate
  | RefreshFiche;
