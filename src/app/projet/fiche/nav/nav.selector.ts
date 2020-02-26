import { createSelector } from "@ngrx/store";

export const nextFiche = createSelector(
  state => state["fiche"],
  ficheState => ficheState.FicheSelectionnerPosition
);
export const validerFiche = createSelector(
  state => state["fiche"],
  ficheState => ficheState.validerFiche
);
