import { FicheService } from "./../fiche.service";
import { locationDesignationModel } from "./../../models/location-designation.model";
import { MaterielModel } from "./../../models/materiel.model";
import { MaterielCmdModel } from "./../../models/materiel-commande.model";
import { FournisseurCommandeModel } from "./../../models/fournisseur-commande.model";
import { FournisseurModel } from "../../models/fournisseur-materiel.model";
import { Router, ActivatedRoute } from "@angular/router";
import * as ficheLocationAction from "./redux/fiche-location.action";
import * as App from "../../../store/app.reducers";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheLocationAction from "./redux/fiche-location.action";
import * as fromFicheAction from "../redux/fiche.action";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable()
export class FicheLocationService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner;
  FicheSelectionner;
  type = "LOCATION";

  fournisseurIdFilter = -1;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private ficheService: FicheService
  ) {
    this.store.select("ficheLocation").subscribe(locState => {
      if (locState.showMaterielByFournisseur.fournisseurNom !== "") {
        this.fournisseurIdFilter =
          locState.showMaterielByFournisseur.fournisseurId;
      }
    });
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(ficheState => {
      if (ficheState.ficheSelectionner !== null)
        this.FicheSelectionner = ficheState.ficheSelectionner;
      this.projetSelectionner = ficheState.projetSelectionner;
    });
  }

  onGetFournisseurs() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<FournisseurModel[]>(
        this.SERVER_ADDRESS +
          "/fournisseurs/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.store.dispatch(
            new fromFicheLocationAction.getFournisseur(fours)
          );

          let f = fours.find(ff => ff.id == this.fournisseurIdFilter);

          if (f !== null) {
            let p = {
              materiels: f.materiels,
              fournisseurNom: f.fournisseurNom,
              fournisseurId: f.id
            };
            this.store.dispatch(
              new ficheLocationAction.showMaterielByFournisseur(p)
            );
          }

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          // this.store.dispatch(
          //   new fromFicheOuvrierAction.ShowAlert({
          //     showAlert: true,
          //     msg: resp.error.message
          //   })
          // );
        }
      );
  }
  onAddFournisseur(nom) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .post<FournisseurCommandeModel>(
        this.SERVER_ADDRESS + "/fournisseurs",
        // this.projetSelectionner.id +
        { id: null, fournisseurNom: nom },
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.onGetFournisseurs();
          this.OnGetFournisseurMaterielNotAsso();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
        }
      );
  }
  onAssoFourToProjet(idFournisseur) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/fournisseurs/" +
          idFournisseur +
          "/projets/" +
          this.projetSelectionner.id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              msg: resp.error.message,
              type: "fournisseur"
            })
          );
        }
      );
  }

  onAddMateriel(ds, unite) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .post<MaterielCmdModel>(
        this.SERVER_ADDRESS + "/materiels",
        // this.projetSelectionner.id +
        { id: null, designation: ds, unite: unite },
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onGetMateriel();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "materiel",
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnAssoMaterielToFournisseur(fourID, MatID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS + "/fournisseurs/" + fourID + "/materiels/" + MatID,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              msg: resp.error.message,
              type: "fournisseur"
            })
          );
        }
      );
  }

  OnDesAssoMaterielToFournisseur(fourID, MatID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(
        this.SERVER_ADDRESS + "/fournisseurs/" + fourID + "/materiels/" + MatID,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "fournisseur",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onAssoMatToProjet(fourId, matId) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fournisseur/" +
          fourId +
          "/materiel/" +
          matId,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              msg: resp.error.message,
              type: "fournisseur"
            })
          );
        }
      );
  }

  onGetMateriel() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<MaterielModel[]>(this.SERVER_ADDRESS + "/materiels", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        materiels => {
          this.store.dispatch(
            new fromFicheLocationAction.getMateriel(materiels)
          );

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          // this.store.dispatch(
          //   new fromFicheOuvrierAction.ShowAlert({
          //     showAlert: true,
          //     msg: resp.error.message
          //   })
          // );
        }
      );
  }
  OnUpdateMateriel(ds, unite, matID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS + "/materiels/" + matID,
        { id: null, designation: ds, unite: unite },

        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.onGetMateriel();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnDeleteMateriel(matID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/materiels/" + matID, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.onGetMateriel();
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "materiel",
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }
  OnUpdateFournisseur(nom, fourID) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<FournisseurCommandeModel>(
        this.SERVER_ADDRESS + "/fournisseurs/" + fourID,
        { id: null, fournisseurNom: nom },

        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.onGetFournisseurs();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          // this.store.dispatch(
          //   new fromFicheOuvrierAction.ShowAlert({
          //     showAlert: true,
          //     msg: resp.error.message
          //   })
          // );
        }
      );
  }
  OnDeleteFournisseur(fourID, ctn) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params = new HttpParams().set("ctn", ctn);

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/fournisseurs/" + fourID, {
        params: params,
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.onGetFournisseurs();
          this.OnGetFournisseurMaterielNotAsso();
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        }
      );
  }
  OnGetFounisseurByMateriel(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<FournisseurModel[]>(
        this.SERVER_ADDRESS +
          "/fournisseurs/projets/" +
          this.projetSelectionner.id +
          "/materiels/" +
          id,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.store.dispatch(
            new fromFicheLocationAction.getFournisseurByMaterielId(fours)
          );

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetFournisseurByProjet() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<FournisseurModel[]>(
        this.SERVER_ADDRESS +
          "/designations/locations/projets/" +
          this.projetSelectionner.id +
          "/fournisseurs",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        frs => {
          this.store.dispatch(
            new fromFicheLocationAction.getFournisseurByProjet(frs)
          );

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnGetFournisseurMaterielNotAsso() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .get<FournisseurModel[]>(
        this.SERVER_ADDRESS + "/fournisseurs/materiels",
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fours => {
          this.store.dispatch(
            new fromFicheLocationAction.getFournisseurLocationNotAsso(fours)
          );

          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fournisseur",
              msg: resp.error.message
            })
          );
        }
      );
  }

  /*  FicheLocation */

  onAddLocationDesignation(locDesignation: locationDesignationModel) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    locDesignation.idFiche = this.FicheSelectionner.id;
    locDesignation.idProjet = this.projetSelectionner.id;

    this.httpClient
      .post<locationDesignationModel>(
        this.SERVER_ADDRESS + "/designations/locations",
        locDesignation,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "locDs",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onUpdateLocationDesignation(locDesignation: locationDesignationModel, id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    locDesignation.idFiche = this.FicheSelectionner.id;
    locDesignation.idProjet = this.projetSelectionner.id;

    this.httpClient
      .put<any>(
        this.SERVER_ADDRESS + "/designations/locations/" + id,
        locDesignation,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        dd => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "locDs",
              msg: resp.error.message
            })
          );
        }
      );
  }

  OnDeleteLocationDesignation(locId) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/designations/locations/" + locId, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.store.dispatch(new fromProjetAction.Refresh(this.type));
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "locDs",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
