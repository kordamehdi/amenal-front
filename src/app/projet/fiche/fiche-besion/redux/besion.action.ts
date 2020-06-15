import { besionModel } from "src/app/projet/models/besion.model";
import { Action } from "@ngrx/store";

export const GET_LIST_BESOIN = "GET_LIST_BESOIN";

export class getListBesion implements Action {
  readonly type = GET_LIST_BESOIN;
  payload: besionModel[];
  constructor(payload: besionModel[]) {
    this.payload = payload;
  }
}
export type ficheBesoinAction = getListBesion;
