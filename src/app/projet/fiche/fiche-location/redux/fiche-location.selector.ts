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
export const fourListState = createSelector(
  state => state["ficheLocation"],
  state => {
    return state.FournisseurListState;
  }
);

export const matListState = createSelector(
  state => state["ficheLocation"],
  state => {
    return state.MaterielListState;
  }
);

export const stateFicheLocation = createSelector(
  state => state["ficheLocation"],
  ficheLocState => {
    return ficheLocState.ficheLocState;
  }
);

export const ss = createSelector(
  state => state["ficheLocation"],
  ficheState => ficheState.showFournisseurByMateriel
);
