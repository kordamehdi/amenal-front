import { documentModel } from "../../../models/fiche-document.model";
import { Action } from "@ngrx/store";
import { destinationModel } from "src/app/projet/models/destination.model";
import { StockDesignationModel } from "src/app/projet/models/stock-designation.model";

export const GET_DOCUMENT = "GET_DOCUMENT";
export const GET_DOCUMENT_ASSO_TO_PROJET = "GET_DOCUMENT_ASSO_TO_PROJET";

export class getDocument implements Action {
  readonly type = GET_DOCUMENT;
  payload: documentModel[];
  constructor(payload: documentModel[]) {
    this.payload = payload;
  }
}

export type FicheDocumentAction = getDocument;
