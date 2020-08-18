import { OuvrierModel } from "./../../../models/ouvrier.model";
import { Action } from "@ngrx/store";

export const START_EDITING = "START_EDITING";
export const FINISH_EDITING = "FINISH_EDITING";
export const START_REMOVE_OUVRIER = "START_REMOVE_OUVRIER";
export const CANCEL_OUVRIER = "CANCEL_OUVRIER";
export const ADD_OUVRIER = "ADD_OUVRIER";
export const GET_OUVRIER = "GET_OUVRIER";
export const SHOW_ALERT_OUVRIER = "SHOW_ALERT_OUVRIER";
export const ALERT_YES = "ALERT_YES";
export const FINISH_REMOVE_OUVRIER = "FINISH_REMOVE_OUVRIER";
export const GET_DESIGNATIONS = "GET_DESIGNATIONS";
export const IS_UPDATE = "IS_UPDATE";
export const GET_FICHE_STATE = "GET_FICHE_STATE";
export const GET_OUV_LIST_STATE = "GET_OUV_LIST_STATE";
export const GET_APPRREC = "GET_APPRREC";
export const GET_VILLE = "GET_VILLE";
export const VILLE_ADED = "VILLE_ADED";

export class AddOuvrier implements Action {
  readonly type = ADD_OUVRIER;
  payload: OuvrierModel;
  constructor(payload: OuvrierModel) {
    this.payload = payload;
  }
}
export class GetOuvrier implements Action {
  readonly type = GET_OUVRIER;
  payload: OuvrierModel[];
  constructor(payload: OuvrierModel[]) {
    this.payload = payload;
  }
}
export class GetDesignations implements Action {
  readonly type = GET_DESIGNATIONS;
  payload: String[];
  constructor(payload: String[]) {
    this.payload = payload;
  }
}
export class StartEditing implements Action {
  readonly type = START_EDITING;
  constructor() {}
}

export class FinishEditing implements Action {
  readonly type = FINISH_EDITING;
  payload: OuvrierModel;
  constructor(payload: OuvrierModel) {
    this.payload = payload;
  }
}

export class StartRemovingOuvrier implements Action {
  readonly type = START_REMOVE_OUVRIER;
  payload: number;
  constructor(payload: number) {
    this.payload = payload;
  }
}
export class FinishRemovingOuvrier implements Action {
  readonly type = FINISH_REMOVE_OUVRIER;
  constructor() {}
}
export class CancelOuvrier implements Action {
  readonly type = CANCEL_OUVRIER;
  payload: number;
  constructor(payload: number) {
    this.payload = payload;
  }
}

export class GetVilles implements Action {
  readonly type = GET_VILLE;
  payload: string[];
  constructor(payload: string[]) {
    this.payload = payload;
  }
}

export class GetApprec implements Action {
  readonly type = GET_APPRREC;
  payload: string[];
  constructor(payload: string[]) {
    this.payload = payload;
  }
}

export class ShowAlert implements Action {
  readonly type = SHOW_ALERT_OUVRIER;
  payload: {
    showAlert: boolean;
    msg: string;
    typeDialog: string;
  };
  constructor(payload) {
    this.payload = payload;
  }
}

export class AlertYes implements Action {
  readonly type = ALERT_YES;
  payload: Boolean;

  constructor(payload) {
    this.payload = payload;
  }
}

export class IsUpdate implements Action {
  readonly type = IS_UPDATE;
  payload: number;
  constructor(payload) {
    this.payload = payload;
  }
}
export class getFicheState implements Action {
  readonly type = GET_FICHE_STATE;
  payload: {
    position: {
      a: number;
      b: number;
      position: number;
    };
    filter: {
      nom: string;
      qualification: string;
    };
    sort: {
      order: any;
      type: string;
    };
  };
  constructor(payload) {
    this.payload = payload;
  }
}
export class getOuvListState implements Action {
  readonly type = GET_OUV_LIST_STATE;
  payload: {
    filter: {
      cin: string;
      nom: string;
      prenom: string;
      qualification: string;
      appreciation: string;
    };
    sort: {
      order: any;
      type: string;
    };
  };
  constructor(payload) {
    this.payload = payload;
  }
}
export class villeAded implements Action {
  readonly type = VILLE_ADED;
  constructor() {}
}

export type FicheAction =
  | StartEditing
  | CancelOuvrier
  | StartRemovingOuvrier
  | FinishEditing
  | AddOuvrier
  | GetOuvrier
  | ShowAlert
  | AlertYes
  | FinishRemovingOuvrier
  | GetDesignations
  | IsUpdate
  | getFicheState
  | getOuvListState
  | GetApprec
  | GetVilles
  | villeAded;
