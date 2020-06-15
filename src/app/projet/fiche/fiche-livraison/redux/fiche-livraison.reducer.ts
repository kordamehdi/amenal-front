import { StockDesignationModel } from "./../../../models/stock-designation.model";
import { destinationModel } from "src/app/projet/models/destination.model";
import * as fromficheLivraisonAction from "./fiche-livraison.action";
export interface ficheLivraisonState {
  destinations: destinationModel[];
  stockArticles: StockDesignationModel[];
  destinationAsso: destinationModel[];
}

const initialState: ficheLivraisonState = {
  destinations: [],
  stockArticles: [],
  destinationAsso: []
};

export function ficheLivraisonReducer(
  state = initialState,
  action: fromficheLivraisonAction.FicheLivraisonAction
): ficheLivraisonState {
  switch (action.type) {
    case fromficheLivraisonAction.GET_DESTINATION: {
      return {
        ...state,
        destinations: action.payload
      };
    }
    case fromficheLivraisonAction.GET_STOCK_ARTICLE: {
      return {
        ...state,
        stockArticles: action.payload
      };
    }
    case fromficheLivraisonAction.GET_DESTINATION_ASSO_TO_PROJET: {
      return {
        ...state,
        destinationAsso: action.payload
      };
    }
    default:
      return { ...state };
  }
}
