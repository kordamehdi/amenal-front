import { validerFiche } from "./../../nav/nav.selector";
import { FicheAction } from "./../../redux/fiche.action";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { FournisseurModel } from "./../../../models/fournisseur-materiel.model";
import { locationDesignationModel } from "./../../../models/location-designation.model";
import { FicheModel } from "./../../../models/fiche.model";
import { MaterielModel } from "./../../../models/materiel.model";
import { FicheLocationService } from "./../fiche-location.service";
import { Store } from "@ngrx/store";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import { NgForm } from "@angular/forms";
import * as fromFicheAction from "../../redux/fiche.action";
import * as moment from "moment";
import { untilDestroyed } from "ngx-take-until-destroy";
@Component({
  selector: "app-fiche-valide-location-desgnation",
  templateUrl: "./fiche-valide-location-desgnation.component.html",
  styleUrls: ["./fiche-valide-location-desgnation.component.scss"]
})
export class FicheValideLocationDesgnationComponent
  implements OnInit, OnDestroy {
  FicheLocation: FicheModel;

  errorMsg = "";
  isValid = [];
  showAlert = false;
  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "locDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        if (state.ficheSelectionner !== null)
          this.FicheLocation = state.ficheSelectionner;

        this.FicheLocation.designations.forEach(
          (d: locationDesignationModel, i) => {
            this.OnInputDate(d.tempsDebut, d.tempsFin, (i = i));
          }
        );
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "LOCATION") {
          this.ficheLocationService.onGetFournisseurByProjet();
          this.ficheService.onGetFicheByType("LOCATION", null);
        }
      });
  }

  OnInputDate(debut, fin, i = "") {
    var startTime = moment(debut, "HH:mm:ss");
    var endTime = moment(fin, "HH:mm:ss");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime));
    // duration in hours
    var hours = duration.asHours();

    // duration in minutes
    var minutes = duration.asMinutes() % 60;

    this.FicheLocation.designations[i].travailleLocString =
      Math.trunc(hours) + "H " + minutes + "M";
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "locDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
