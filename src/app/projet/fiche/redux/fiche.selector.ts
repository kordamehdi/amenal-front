import { createSelector } from "@ngrx/store";

export const fiche = createSelector(
  state => state["fiche"],
  ficheState => {
    return ficheState.ficheSelectionner;
  }
);

export const listeAdmin = createSelector(
  state => state["fiche"],
  ficheState => {
    return ficheState.listerOuvrier;
  }
);
