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
  | IsUpdate;
