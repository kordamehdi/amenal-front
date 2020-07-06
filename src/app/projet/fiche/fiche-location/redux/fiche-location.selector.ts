import { createSelector } from "@ngrx/store";

export const fourMAt = createSelector(
  state => state["ficheLocation"],
  ficheState => {
    return {
      fournisseurs: ficheState.fournisseurs,
      materiels: ficheState.materiels,
      showFournisseurByMateriel: ficheState.showFournisseurByMateriel
    };
  }
);

export const ss = createSelector(
  state => state["ficheLocation"],
  ficheState => ficheState.showFournisseurByMateriel
);
