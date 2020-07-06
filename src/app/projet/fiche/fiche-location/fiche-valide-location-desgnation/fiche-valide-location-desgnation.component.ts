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
  @ViewChild("f", { static: false })
  form: NgForm;
  FicheLocation: FicheModel;
  designtions$ = [];
  designtions = [];
  typeAsc;
  errorMsg = "";
  isValid = [];
  showAlert = false;
  navPas = 1;
  position = 1;
  size;
  ascendant = [];
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
          this.FicheLocation = { ...state.ficheSelectionner };

        if (this.FicheLocation.designations.length > 0) {
          this.onFilter();
        } else {
          this.designtions = [];
          this.designtions$ = [];
        }
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

  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      let a = this.navPas * this.position;
      let b = a - this.navPas;
      this.designtions = this.designtions$.slice(b, a);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.designtions = this.designtions$.slice(b, a);
    }
  }
  onFilterBur(input) {
    if (input.value.trim() === "") {
      this.designtions$ = this.designtions$;
      this.designtions = this.designtions$;
      /*.slice(0, this.navPas);
      this.size = Math.trunc(this.designtions$.length / this.navPas);
      if (this.size < this.designtions$.length / this.navPas)
        this.size = this.size + 1;*/
    }
  }

  onFilter() {
    let inputSearchName = ["libelle", "fournisseurNom"];
    this.designtions$ = this.FicheLocation.designations;
    if (typeof this.form !== "undefined")
      inputSearchName.forEach((key: string) => {
        if (typeof this.form.value[key.concat("$")] !== "undefined") {
          let vv = this.form.value[key.concat("$")].trim().toUpperCase();
          if (vv !== "") {
            let v = this.designtions$;
            this.designtions$ = v.filter(d => {
              return d[key].includes(vv);
            });
          }
        }
      });
    this.position = 1;
    this.designtions = this.designtions$;
    this.designtions.forEach((d: locationDesignationModel, i) => {
      this.OnInputDate(d.tempsDebut, d.tempsFin, i.toString());
    });
    this.designtions = this.designtions$.slice(0, this.navPas);
    this.size = Math.trunc(this.designtions$.length / this.navPas);
    if (this.size < this.designtions$.length / this.navPas)
      this.size = this.size + 1;
  }

  /*********** */

  /********** */

  onSort(type) {
    // descending order z->a
    this.typeAsc = type;
    this.ascendant[type] = !this.ascendant[type];
    if (!this.ascendant[type])
      this.designtions = this.designtions.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (b[type] > a[type]) {
          return 1;
        }
        return 0;
      });
    if (this.ascendant[type])
      this.designtions = this.designtions.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        }
        if (b[type] < a[type]) {
          return 1;
        }
        return 0;
      });
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
