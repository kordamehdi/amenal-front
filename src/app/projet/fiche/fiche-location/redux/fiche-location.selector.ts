import { createSelector } from "@ngrx/store";
import * as _ from "lodash";

/* MATERIEL */
export const matFilterKeyWord = createSelector(
  state => state["ficheLocation"],
  state => {
    return state.MaterielFilterKeyWord;
  }
);

export const showMaterielByFournisseur = createSelector(
  state => state["ficheLocation"],
  state => state.showMaterielByFournisseur
);
export const materiels = createSelector(
  state => state["ficheLocation"],
  state => state.materiels
);
export const fournisseurs = createSelector(
  state => state["ficheLocation"],
  state => state.fournisseurs
);

export const matListState = createSelector(
  showMaterielByFournisseur,
  materiels,
  fournisseurs,
  (showMaterielByFournisseur, materiels, fournisseurs) => {
    return {
      showMaterielByFournisseur: showMaterielByFournisseur,
      materiels: materiels,
      fournisseurs: fournisseurs
    };
  }
);
/* MATERIEL */

/* FOURNISSEUR */

export const fourFilterKeyWord = createSelector(
  state => state["ficheLocation"],
  state => {
    return state.fourFilterKeyWord;
  }
);

export const fournisseurMaterielNotAsso = createSelector(
  state => state["ficheLocation"],
  state => state.fournisseurMaterielNotAsso
);

export const showFournisseurByMateriel = createSelector(
  state => state["ficheLocation"],
  state => state.showFournisseurByMateriel
);

export const fourListState = createSelector(
  fournisseurMaterielNotAsso,
  materiels,
  showFournisseurByMateriel,
  fournisseurs,
  (
    fournisseurMaterielNotAsso,
    materiels,
    showFournisseurByMateriel,
    fournisseurs
  ) => {
    return {
      fournisseurs: fournisseurs,
      materiels: materiels,
      showFournisseurByMateriel: showFournisseurByMateriel,
      fournisseurMaterielNotAsso: fournisseurMaterielNotAsso
    };
  }
);

/* FOURNISSEUR */

export const stateFicheLocation = createSelector(
  state => state["ficheLocation"],
  ficheLocState => {
    return ficheLocState.ficheLocState;
  }
);
