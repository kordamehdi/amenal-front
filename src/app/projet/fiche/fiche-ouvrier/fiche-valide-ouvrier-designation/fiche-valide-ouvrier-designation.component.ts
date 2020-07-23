import { stateFicheOuvrier } from "./../redux/fiche-ouvrier.selector";
import { FicheService } from "./../../fiche.service";
import { nextFiche, validerFiche } from "./../../nav/nav.selector";
import { ProjetModel } from "./../../../models/projet.model";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import { Store } from "@ngrx/store";
import { FicheOuvrierDesignationService } from "../fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import * as moment from "moment";
import { refresh } from "../../header/head.selector";
import { untilDestroyed } from "ngx-take-until-destroy";
import * as fromFicheOuvrierAction from "../redux/fiche-ouvrier.action";
import { NgForm } from "@angular/forms";
import { ouvrierDesignationModel } from "src/app/projet/models/ouvrierDesignation.model";

@Component({
  selector: "app-fiche-valide-ouvrier-designation",
  templateUrl: "./fiche-valide-ouvrier-designation.component.html",
  styleUrls: ["./fiche-valide-ouvrier-designation.component.scss"]
})
export class FicheValideOuvrierDesignationComponent
  implements OnDestroy, AfterViewInit {
  @ViewChild("f", { static: false })
  form: NgForm;

  columnDesignation: String[];
  FicheOuvrier: any;
  projetSelectionner: ProjetModel;
  ouvrierCin: String;
  ouvrierQualification: String;
  ouvDsSlIndex: number;
  ascendant = true;
  designationOuvrier: ouvrierDesignationModel[] = [];
  designationOuvrier$: ouvrierDesignationModel[] = [];
  designationOuvrier$$: ouvrierDesignationModel[] = [];
  showAlert: Boolean = false;
  errorMsg = "Erreur!";
  Trv: string;
  dateFinMax;
  dateAgeMax;
  DateAcntMax;

  navPas = 2;
  position = 1;
  size;
  a = 0;
  b = this.navPas;

  SearchByNom = "";
  SearchByQual = "";
  constructor(
    private ficheService: FicheService,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService,
    private store: Store<App.AppState>
  ) {}

  ngAfterViewInit() {
    this.store.select("ficheOuvrier").subscribe(state => {
      this.columnDesignation = state.columnDesignation;
    });

    this.store
      .select(stateFicheOuvrier)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        setTimeout(() => {
          console.log("init ", state.filter);
          this.a = state.position.a;
          this.b = state.position.b;
          this.position = state.position.position;
          this.SearchByNom = state.filter.nom;
          this.SearchByQual = state.filter.qualification;
          this.ascendant = state.sort;
          this.onFilter(true);
        }, 0);
      });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        setTimeout(() => {
          if (
            state.type === "fiche-valide-ouvrier-ds" ||
            state.type === "fiche"
          ) {
            this.errorMsg = state.errorMsg;
            this.showAlert = state.showAlert;
          }
          this.projetSelectionner = state.projetSelectionner;

          this.FicheOuvrier = { ...state.ficheSelectionner };

          if (this.FicheOuvrier.designations.length !== 0)
            this.designationOuvrier$$ = this.FicheOuvrier.designations;

          this.onFilter(true);
        }, 0);
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
      this.onSort(true);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.designationOuvrier = this.designationOuvrier$.slice(b, a);
      this.onSort(true);
    }
  }

  onFilter(init) {
    this.designationOuvrier$ = this.slice(this.designationOuvrier$$);

    if (typeof this.form !== "undefined") {
      if (typeof this.form.controls["nomOuv$"] !== "undefined") {
        if (init) {
          this.form.controls["nomOuv$"].setValue(
            this.SearchByNom.toLowerCase()
          );
          this.form.controls["qualification$"].setValue(
            this.SearchByQual.toLowerCase()
          );
        } else {
          this.SearchByNom = this.form.controls["nomOuv$"].value
            .trim()
            .toUpperCase();
          this.SearchByQual = this.form.controls["qualification$"].value
            .trim()
            .toUpperCase();
        }
      }
    }

    this.designationOuvrier$ = this.designationOuvrier$.filter(d => {
      return (
        d.nom.includes(this.SearchByNom) &&
        d.qualification.includes(this.SearchByQual)
      );
    });
    if (!init && (this.SearchByNom !== "" || this.SearchByQual !== "")) {
      this.a = 0;
      this.b = this.navPas;
      this.position = 1;
    }
    this.designationOuvrier = this.designationOuvrier$.slice(this.a, this.b);
    this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
    if (this.size < this.designationOuvrier$.length / this.navPas)
      this.size = this.size + 1;
    this.onSort(true);
  }
  onSort(init) {
    // descending order z->a
    if (!init) this.ascendant = !this.ascendant;
    if (!this.ascendant)
      this.designationOuvrier = this.designationOuvrier.sort((a, b) => {
        if (a.nom > b.nom) {
          return -1;
        }
        if (b.nom > a.nom) {
          return 1;
        }
        return 0;
      });
    if (this.ascendant)
      this.designationOuvrier = this.designationOuvrier.sort((a, b) => {
        if (a.nom < b.nom) {
          return -1;
        }
        if (b.nom < a.nom) {
          return 1;
        }
        return 0;
      });
  }

  slice(Dss) {
    return [...Dss].map(m => JSON.parse(JSON.stringify(m)));
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
    this.store.dispatch(
      new fromFicheOuvrierAction.getFicheState({
        position: {
          a: this.a,
          b: this.b,
          position: this.position
        },
        filter: {
          nom: this.SearchByNom,
          qualification: this.SearchByQual
        },
        sort: this.ascendant
      })
    );
  }
}
