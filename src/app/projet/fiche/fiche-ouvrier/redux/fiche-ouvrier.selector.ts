import { createSelector } from "@ngrx/store";

export const stateFicheOuvrier = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.ficheState;
  }
);
export const stateListOuvrier = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.ouvListState;
  }
);
