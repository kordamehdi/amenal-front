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
/* OUVRIER */
export const qualifications = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.qualifications;
  }
);
export const villes = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.villes;
  }
);
export const appreciations = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.appreciations;
  }
);
export const ouvriers = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.ouvriers;
  }
);

export const ouvState = createSelector(
  qualifications,
  ouvriers,
  villes,
  appreciations,
  (qualifications, ouvriers, villes, appreciations) => {
    return {
      ouvriers: ouvriers,
      appreciations: appreciations,
      villes: villes,
      qualifications: qualifications
    };
  }
);

/* OUVRIER */

export const villeOrQualOrApprecAdded = createSelector(
  state => state["ficheOuvrier"],
  ficheState => {
    return ficheState.villeAded;
  }
);
