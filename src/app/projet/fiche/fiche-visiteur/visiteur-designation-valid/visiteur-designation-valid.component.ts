import { VisiteurDesignationModel } from "./../../../models/fiche-visiteur.model";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { FicheService } from "./../../fiche.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { validerFiche } from "../../nav/nav.selector";
import { untilDestroyed } from "ngx-take-until-destroy";
import { refresh } from "../../header/head.selector";
import { VisiteurDesignationService } from "../visiteur-designation/visiteur-designation.service";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";
import * as moment from "moment";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-visiteur-designation-valid",
  templateUrl: "./visiteur-designation-valid.component.html",
  styleUrls: ["./visiteur-designation-valid.component.scss"]
})
export class VisiteurDesignationValidComponent implements OnInit, OnDestroy {
  errorMsg;
  showAlert;
  ficheVisiteur: FicheModel;
  designation$;
  isValid;
  selectedDsIndex = -1;
  selectedDsId = -1;
  visiteursAsso$: visiteurModel[];
  visiteursAsso: visiteurModel[];
  visiteurSelected = false;
  update = -1;
  formNames = ["visiteurId", "nom", "organisme", "objet", "depart", "arivee"];
  now;
  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "vsDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        this.ficheVisiteur = state.Fiches[state.FicheSelectionnerPosition];
        this.isValid = this.ficheVisiteur.isValidated;

        this.designation$ = this.ficheVisiteur.designations;
      });

    this.store.select("ficheVisiteur").subscribe(state => {
      this.visiteursAsso = this.visiteursAsso$ = state.visiteursAsso;
    });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === this.ficheVisiteur.type) {
          this.ficheService.onGetFicheByType("VISITEUR", null);
        }
      });
  }

  onUpdateClick(i) {
    this.selectedDsIndex = i;
  }
  onUpdateClickOutside(i) {
    if (this.selectedDsIndex === i) this.selectedDsIndex = -1;
  }

  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "vsDs",
        showAlert: false,
        msg: ""
      })
    );
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
