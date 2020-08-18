import { createSelector } from "@ngrx/store";

export const innerHeight = createSelector(
  state => state["projet"],
  state => state.innerHeight
);

export const listeAdmin = createSelector(
  state => state["fiche"],
  ficheState => {
    return ficheState.listerOuvrier;
  }
);

export const dimension = createSelector(
  innerHeight,
  listeAdmin,
  (innerHeight, listeAdmin) => {
    return {
      innerHeight: innerHeight,
      listeAdmin: listeAdmin
    };
  }
);
