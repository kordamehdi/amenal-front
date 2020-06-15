import { ActionReducerMap } from "@ngrx/store";
import * as fromFiche from "../projet/fiche/redux/fiche.reducers";
import * as fromProjet from "../projet/redux/projet.reducers";
import * as fromFicheOuvrier from "../projet/fiche/fiche-ouvrier/redux/fiche-ouvrier.reducers";
import * as fromFicheLocation from "../projet/fiche/fiche-location/redux/fiche-location.redux";
import * as fromficheReception from "../projet/fiche/fiche-reception/redux/fiche-reception.reducer";
import * as fromFicheLivraison from "../projet/fiche/fiche-livraison/redux/fiche-livraison.reducer";
import * as fromFicheDocument from "../projet/fiche/fiche-document/redux/fiche-document.reducer";
import * as fromFicheBesoin from "../projet/fiche/fiche-besion/redux/besion.reducer";
import * as fromFicheVisiteur from "../projet/fiche/fiche-visiteur/redux/fiche-visiteur.reducer";
import * as fromficheActivite from "../projet/fiche/fiche-activite/redux/fiche-activite.reducer";
export interface AppState {
  fiche: fromFiche.FicheList;
  projet: fromProjet.projetState;
  ficheOuvrier: fromFicheOuvrier.ficheOuvrierState;
  ficheLocation: fromFicheLocation.ficheLocationState;
  ficheReception: fromficheReception.FicheReceptionState;
  ficheLivraison: fromFicheLivraison.ficheLivraisonState;
  ficheDocument: fromFicheDocument.ficheDocumentState;
  ficheBesion: fromFicheBesoin.ficheBesionState;
  ficheVisiteur: fromFicheVisiteur.ficheVisiteurState;
  ficheActivite: fromficheActivite.FicheActiviteState;
}

export const reducers: ActionReducerMap<AppState> = {
  fiche: fromFiche.FicheReducer,
  projet: fromProjet.ProjetReducer,
  ficheOuvrier: fromFicheOuvrier.OuvrierReducer,
  ficheLocation: fromFicheLocation.ficheLocationReducer,
  ficheReception: fromficheReception.FicheReducer,
  ficheLivraison: fromFicheLivraison.ficheLivraisonReducer,
  ficheDocument: fromFicheDocument.ficheDocumentReducer,
  ficheBesion: fromFicheBesoin.ProjetReducer,
  ficheVisiteur: fromFicheVisiteur.ficheVisiteurReducer,
  ficheActivite: fromficheActivite.FicheActiviteReducer
};
