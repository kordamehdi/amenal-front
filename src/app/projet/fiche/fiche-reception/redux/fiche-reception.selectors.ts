import { createSelector } from "@ngrx/store";
import * as _ from "lodash";

/* FOURNISSEUR */
export const fournisseurArticleNonAsso = createSelector(
  state => state["ficheReception"],
  state => {
    return state.fournisseurArticleNonAsso;
  }
);
export const categories = createSelector(
  state => state["ficheReception"],
  state => {
    return state.categories;
  }
);
export const showFournisseurByArticleOrCategorie = createSelector(
  state => state["ficheReception"],
  state => {
    return state.showFournisseurByArticleOrCategorie;
  }
);

export const fournisseurArticleAsso = createSelector(
  state => state["ficheReception"],
  state => {
    return state.fournisseurArticleAsso;
  }
);
export const fourState = createSelector(
  fournisseurArticleNonAsso,
  categories,
  showFournisseurByArticleOrCategorie,
  fournisseurArticleAsso,
  (
    fournisseurArticleNonAsso,
    categories,
    showFournisseurByArticleOrCategorie,
    fournisseurArticleAsso
  ) => {
    return {
      fournisseurArticleNonAsso: fournisseurArticleNonAsso,
      categories: categories,
      showFournisseurByArticleOrCategorie: showFournisseurByArticleOrCategorie,
      fournisseurArticleAsso: fournisseurArticleAsso
    };
  }
);
/* FOURNISSEUR */
/* ARTICLE */

export const showArticleByFournisseurId = createSelector(
  state => state["ficheReception"],
  state => {
    return state.showArticleByFournisseurId;
  }
);

export const showDetails = createSelector(
  state => state["ficheReception"],
  state => {
    return state.showDetails;
  }
);

export const artState = createSelector(
  fournisseurArticleNonAsso,
  categories,
  showArticleByFournisseurId,
  fournisseurArticleAsso,
  showDetails,
  (
    fournisseurArticleNonAsso,
    categories,
    showArticleByFournisseurId,
    fournisseurArticleAsso,
    showDetails
  ) => {
    return {
      fournisseurArticleNonAsso: fournisseurArticleNonAsso,
      categories: categories,
      showArticleByFournisseurId: showArticleByFournisseurId,
      fournisseurArticleAsso: fournisseurArticleAsso,
      showDetails: showDetails
    };
  }
);

/* ARTICLE */

/* lIST RECEPTION */

export const ListRecState = createSelector(
  state => state["ficheReception"],
  state => {
    return state.ListRecState;
  }
);
export const fiche = createSelector(
  state => state["fiche"],
  ficheState => {
    return ficheState.ficheSelectionner;
  }
);

export const listRec = createSelector(
  fiche,
  ListRecState,
  (fiche, ListRecState) => {
    return {
      fiche: fiche,
      ListRecState: ListRecState
    };
  }
);

/* lIST RECEPTION */
