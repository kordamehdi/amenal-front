import { createSelector } from "@ngrx/store";

export const positionFicheVisiteur = createSelector(
  state => state["ficheOuvrier"],
  ficheState => ficheState.positionFiche
);
