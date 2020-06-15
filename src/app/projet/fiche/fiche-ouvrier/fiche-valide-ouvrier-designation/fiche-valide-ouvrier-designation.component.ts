import { FicheService } from "./../../fiche.service";
import { nextFiche, validerFiche } from "./../../nav/nav.selector";
import { ProjetModel } from "./../../../models/projet.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { FicheOuvrierDesignationService } from "../fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import * as moment from "moment";
import { refresh } from "../../header/head.selector";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-fiche-valide-ouvrier-designation",
  templateUrl: "./fiche-valide-ouvrier-designation.component.html",
  styleUrls: ["./fiche-valide-ouvrier-designation.component.scss"]
})
export class FicheValideOuvrierDesignationComponent
  implements OnInit, OnDestroy {
  columnDesignation: String[];
  FicheOuvrier: any;
  projetSelectionner: ProjetModel;
  ouvrierCin: String;
  ouvrierQualification: String;
  ouvDsSlIndex: number;

  designationOuvrier = [];
  designationOuvrier$ = [];

  showAlert: Boolean = false;
  errorMsg = "Erreur!";
  Trv: string;
  dateFinMax;
  dateAgeMax;
  DateAcntMax;

  navPas = 5;
  position = 1;
  size;
  constructor(
    private ficheService: FicheService,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.store.select("ficheOuvrier").subscribe(state => {
      this.columnDesignation = state.columnDesignation;
    });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (
          state.type === "fiche-valide-ouvrier-ds" ||
          state.type === "fiche"
        ) {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.projetSelectionner = state.projetSelectionner;

        this.FicheOuvrier = state.Fiches[state.FicheSelectionnerPosition];

        if (this.FicheOuvrier.designations.length !== 0) {
          this.designationOuvrier$ = this.FicheOuvrier.designations;
          this.designationOuvrier = this.FicheOuvrier.designations.slice(
            0,
            this.navPas
          );
          this.size = Math.trunc(
            this.FicheOuvrier.designations.length / this.navPas
          );
          if (this.size < this.FicheOuvrier.designations.length / this.navPas)
            this.size = this.size + 1;
        }
      });

    this.store
      .select(nextFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.ouvrierQualification = this.ouvrierCin = "";
      });

    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "OUVRIER") {
          this.ficheService.validerFiche(this.FicheOuvrier.id, "ouvriers");
        }
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "OUVRIER") {
          this.ficheOuvrierDesignationService.onGetOuvrierByProjet();
          this.ficheService.onGetFicheByType("OUVRIER", null);
        }
      });
  }

  /***************** */
  onClick(i) {
    this.ouvDsSlIndex = i;
  }
  onClickOutside(i) {
    if (this.ouvDsSlIndex === i) this.ouvDsSlIndex = -1;
  }
  /***************** */

  calculTravail(dateDebut, dateFin) {
    var startTime = moment(dateDebut, "HH:mm:ss");
    var endTime = moment(dateFin, "HH:mm:ss");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime));

    // duration in hours
    var hours = duration.asHours();

    // duration in minutes
    var minutes = duration.asMinutes() % 60;

    return Math.trunc(hours) + "H " + minutes + "M";
  }

  /*******/
  onDelete() {
    this.onHideAlert();
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "fiche-valide-ouvrier-ds"
      })
    );
  }

  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      let a = this.navPas * this.position;
      let b = a - this.navPas;
      this.designationOuvrier = this.designationOuvrier$.slice(b, a);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.designationOuvrier = this.designationOuvrier$.slice(b, a);
    }
  }

  onFilterFocus(input) {
    input.disabled = false;
    if (input.value === "NOM & PRENOM") input.value = "";
  }
  onFilterBur(input) {
    if (input.value.trim() === "") {
      input.value = "NOM & PRENOM";
      this.designationOuvrier$ = this.FicheOuvrier.designations;
      this.designationOuvrier = this.designationOuvrier$.slice(0, this.navPas);
      this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
      if (this.size < this.designationOuvrier$.length / this.navPas)
        this.size = this.size + 1;
    }
  }

  onFilter(value, type) {
    if (value.trim() == "") {
      this.designationOuvrier$ = this.FicheOuvrier.designations;
    } else {
      this.designationOuvrier$ = this.FicheOuvrier.designations.filter(d => {
        return d[type].includes(value.toUpperCase());
      });
    }

    this.designationOuvrier = this.designationOuvrier$.slice(0, this.navPas);
    this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
    if (this.size < this.designationOuvrier$.length / this.navPas)
      this.size = this.size + 1;
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
