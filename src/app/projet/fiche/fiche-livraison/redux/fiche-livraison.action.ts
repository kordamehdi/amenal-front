import { Action } from "@ngrx/store";
import { destinationModel } from "src/app/projet/models/destination.model";
import { StockDesignationModel } from "src/app/projet/models/stock-designation.model";

export const GET_DESTINATION = "GET_DESTINATION";
export const GET_STOCK_ARTICLE = "GET_STOCK_ARTICLE";
export const GET_DESTINATION_ASSO_TO_PROJET = "GET_DESTINATION_ASSO_TO_PROJET";

export class getDestination implements Action {
  readonly type = GET_DESTINATION;
  payload: destinationModel[];
  constructor(payload: destinationModel[]) {
    this.payload = payload;
  }
}
export class getStockArticle implements Action {
  readonly type = GET_STOCK_ARTICLE;
  payload: StockDesignationModel[];
  constructor(payload: StockDesignationModel[]) {
    this.payload = payload;
  }
}
export class getDestinationAssoToProjet implements Action {
  readonly type = GET_DESTINATION_ASSO_TO_PROJET;
  payload: destinationModel[];
  constructor(payload: destinationModel[]) {
    this.payload = payload;
  }
}
export type FicheLivraisonAction =
  | getDestination
  | getStockArticle
  | getDestinationAssoToProjet;
