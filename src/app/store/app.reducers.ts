import { ActionReducerMap } from "@ngrx/store";
import * as fromFiche from "../projet/fiche/redux/fiche.reducers";
import * as fromProjet from "../projet/redux/projet.reducers";
import * as fromFicheOuvrier from "../projet/fiche/fiche-ouvrier/redux/fiche-ouvrier.reducers";
export interface AppState {
  fiche: fromFiche.FicheList;
  projet: fromProjet.projetState;
  ficheOuvrier: fromFicheOuvrier.ficheOuvrierState;
}

export const reducers: ActionReducerMap<AppState> = {
  fiche: fromFiche.FicheReducer,
  projet: fromProjet.ProjetReducer,
  ficheOuvrier: fromFicheOuvrier.OuvrierReducer
};
