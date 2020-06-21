import { createSelector } from "@ngrx/store";

export const refresh = createSelector(
  state => state["projet"],
  projetState => projetState.refreshComp
);
export const typeChange = createSelector(
  state => state["fiche"],
  state => {
    if (state.ficheSelectionner !== null) {
      return state.ficheSelectionner.type;
    } else return "";
  }
);
