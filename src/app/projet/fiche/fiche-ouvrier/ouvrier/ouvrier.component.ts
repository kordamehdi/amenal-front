import { Store } from "@ngrx/store";
import { FicheOuvrierService } from "./../fiche-ouvrier.service";
import { OuvrierModel } from "./../../../models/ouvrier.model";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromFicheOuvrierAction from "../redux/fiche-ouvrier.action";

import * as moment from "moment";
import { untilDestroyed } from "ngx-take-until-destroy";
import { stateListOuvrier } from "../redux/fiche-ouvrier.selector";

@Component({
  selector: "app-ouvrier",
  templateUrl: "./ouvrier.component.html",
  styleUrls: ["./ouvrier.component.scss"]
})
export class OuvrierComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  isCompleted: boolean = false;
  addOuvToProjet$ = true;
  aaa = true;
  isFocus = false;
  isFocus$ = false;
  projetSelectionnerId;
  ouvriers: OuvrierModel[];
  columnOuvrier: String[];
  qualifications: String[];
  qualifications$: String[];
  hasError: Boolean = false;
  errorMsg = "Erreur!";
  listerOuvrier: Boolean;
  isUpdate = -1;
  focusID = -1;
  ouvSl = -1;
  ouvToDelete = -1;
  up = false;
  ouvrierRemovingId = -1;
  qualificationIsSelected = false;
  qualificationToAdd = "";
  dateAgeMax;
  DateAcntMax;
  ouvriers$ = [];
  ouvriers$$ = [];
  ascendant = [];
  typeAsc = "";
  isValid;
  showAlert;
  qualificationToDelete = "";
  navPas = 3;
  position = 1;
  a = 0;
  b = this.navPas;
  size;
  inputSearchName = ["cin", "nom", "prenom", "qualification", "appreciation"];
  filterState = {
    cin: "",
    nom: "",
    prenom: "",
    qualification: "",
    appreciation: ""
  };
  screenHeight = "";
  constructor(
    private ficheOuvrierService: FicheOuvrierService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.ficheOuvrierService.onGetOuvriers();

    this.dateAgeMax = moment()
      .subtract(18, "years")
      .format("YYYY-MM-DD");
    console.log(this.dateAgeMax);
    this.DateAcntMax = moment().format("YYYY-MM-DD");

    this.ficheOuvrierService.onGetQualifications();
    this.store.select("projet").subscribe(state => {
      this.screenHeight = (state.innerHeight * 0.7).toString().concat("px");
    });
    this.store
      .select(stateListOuvrier)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.a = state.position.a;
        this.b = state.position.b;
        this.position = state.position.position;
        this.filterState = state.filter;
        this.ascendant = state.sort.order;
        this.typeAsc = state.sort.type;
        this.onFilter(true);
      });

    this.store
      .select("ficheOuvrier")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.columnOuvrier = state.columnOuvrier;
        this.qualifications$ = state.qualifications;
        this.qualifications = [...this.qualifications$];
        this.ouvriers$$ = [];
        this.ouvriers$ = [];
        this.ouvriers = [];

        this.isUpdate = state.isOuvrierUpdate;

        if (state.ouvriers !== null)
          if (state.ouvriers.length !== 0) {
            this.ouvriers$$ = state.ouvriers;
          }
        this.onFilter(true);
      });
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "ouvrier") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.projetSelectionnerId = state.projetSelectionner.id;

        this.listerOuvrier = state.listerOuvrier;
        this.isValid = state.ficheSelectionner.isValidated;
      });
  }

  OnAddOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin"],
      nom: this.form.value["nom"],
      prenom: this.form.value["prenom"],
      qualification: this.form.value["qual"],
      dateNaissance: this.form.value["age"],
      dateRecrutement: this.form.value["ancienter"],
      j_trv: null,
      tele: this.form.value["tele"],
      appreciation: this.form.value["appreciation"],
      isAsso: null
    };
    this.isUpdate = -1;
    this.ficheOuvrierService.OnSaveOuvrier(ouvrier);
    this.qualificationIsSelected = false;
    this.addFormReset();
  }
  OnUpdateOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin".concat(this.ouvSl.toString())],
      nom: this.form.value["nom".concat(this.ouvSl.toString())],
      prenom: this.form.value["prenom".concat(this.ouvSl.toString())],
      qualification: this.form.value["qual".concat(this.ouvSl.toString())],
      dateNaissance: this.form.value["age".concat(this.ouvSl.toString())],
      dateRecrutement: this.form.value[
        "ancienter".concat(this.ouvSl.toString())
      ],
      j_trv: null,
      tele: this.form.value["tele".concat(this.ouvSl.toString())],
      appreciation: this.form.value[
        "appreciation".concat(this.ouvSl.toString())
      ],
      isAsso: null
    };
    this.isUpdate = -1;
    this.focusID = -1;
    this.ficheOuvrierService.OnUpdateOuvrier(ouvrier, this.ouvSl);
  }

  addOuvToProjets(idOuvrier) {
    if (this.addOuvToProjet$)
      this.ficheOuvrierService.onAddOuvrierToProjet(idOuvrier);
  }

  onQualificationSearch(value: string) {
    let v = value.trim().toUpperCase();
    if (v == "") this.qualifications = [...this.qualifications$];
    else this.qualifications = this.qualifications$.filter(q => q.includes(v));
  }

  onAddClickOutside() {
    if (this.isUpdate === 0 && this.addFormIsDirty("")) {
      let submit = true;
      this.qualificationToAdd = this.form.controls["qual"].value
        .trim()
        .toUpperCase();
      if (
        !this.qualifications.includes(this.qualificationToAdd) &&
        this.qualificationToAdd != ""
      ) {
        this.qualificationIsSelected = false;
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "ouvrier",
            msg:
              "Est ce que vous voulais ajouté la qualification [ " +
              this.qualificationToAdd +
              " ] ?"
          })
        );
        this.isUpdate = -1;
      } else {
        this.columnOuvrier.forEach((key: any) => {
          if (this.form.value[key] !== null) {
            if (this.form.controls[key].invalid) {
              submit = false;
              this.store.dispatch(
                new fromFicheAction.ShowFicheAlert({
                  showAlert: true,
                  type: "ouvrier",
                  msg: "le champs [ " + key + " ] est invalid!"
                })
              );
            }
          }
        });
        if (submit) this.form.ngSubmit.emit();
        else {
          this.ouvSl = -1;
          this.isUpdate = -1;
        }
      }
    }
  }
  onAddClick() {
    if (this.isUpdate !== 0) {
      this.isUpdate = 0;
      this.ouvSl = -1;
    }
  }

  onSelectQualification(qual) {
    this.qualificationIsSelected = true;
    this.form.controls["qual"].setValue(qual);
  }
  onLongPressQualification(qual) {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: true,
        type: "ouvrier",
        msg:
          "Vous Etes sur de vouloire supprimer la qualification [ " +
          qual +
          " ]?"
      })
    );
    this.qualificationToDelete = qual;
  }
  onUpdateClickedOutside(i) {
    if (this.ouvSl === i) {
      this.addOuvToProjet$ = true;
      this.aaa = true;
      if ((this.isUpdate === 1 && this.addFormIsDirty(i.toString())) || this.up)
        this.form.ngSubmit.emit();
      else this.focusID = -1;
      this.columnOuvrier.forEach((key: any) => {
        if (this.form.controls[key.concat(i.toString())].enabled) {
          this.form.controls[key.concat(i.toString())].disable();
        }
      });
      this.up = false;
      this.ouvSl = -1;
    }
  }

  onUpdateClick(i) {
    this.isUpdate = 1;
    setTimeout(() => {
      this.addOuvToProjet$ = false;

      this.ouvSl = i;
      this.focusID = i;
      this.columnOuvrier.forEach((key: any) => {
        if (this.form.controls[key.concat(i.toString())].disabled)
          this.form.controls[key.concat(i.toString())].enable();
      });
    }, 200);
  }
  onFocusQualificationInput(list) {
    list.hidden = false;
  }
  onBlurQualificationInput(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 300);
  }

  onFocusQualUpdateInput(qual) {
    qual.hidden = false;
  }
  onBlurQualUpdateInput(qual) {
    setTimeout(() => {
      qual.hidden = true;
    }, 100);
  }

  onSelectQualUpdate(item, id: number) {
    this.up = true;
    this.form.controls["qual".concat(id.toString())].setValue(item);
  }

  onLongPress(ouvId) {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: true,
        type: "ouvrier",
        msg: "Vous Etes sur de vouloire supprimer l' ouvrier?"
      })
    );
    this.ouvToDelete = ouvId;
  }
  onContinue() {
    if (this.qualificationToAdd !== "") {
      this.ficheOuvrierService.addQualification(this.qualificationToAdd);
      this.form.controls["qual"].setValue(
        this.qualificationToAdd.trim().toUpperCase()
      );
      this.qualificationIsSelected = true;
      this.qualificationToAdd = "";
    } else if (this.ouvToDelete !== -1) {
      this.ficheOuvrierService.OnDeleteOuvrier(this.ouvToDelete);
      this.ouvToDelete = -1;
    } else if (this.qualificationToDelete != "") {
      this.ficheOuvrierService.OnDeleteQualification(
        this.qualificationToDelete
      );
      this.qualificationToDelete = "";
    }
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "ouvrier",
        msg: ""
      })
    );
  }
  onHideAlert() {
    this.addFormReset();
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "ouvrier",
        msg: ""
      })
    );
  }

  onFilterBur(input, type) {
    /* this.ouvriers = this.ouvriers$.slice(0, this.navPas);
      this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
      if (this.size < this.designationOuvrier$.length / this.navPas)
        this.size = this.size + 1;*/
  }

  onFilter(init) {
    this.ouvriers$ = [...this.ouvriers$$];
    let empty = true;
    if (typeof this.form !== "undefined")
      this.inputSearchName.forEach((key: string) => {
        if (init) {
          this.form.controls[key.concat("$")].setValue(this.filterState[key]);
        }
        this.filterState[key] = this.form.value[key.concat("$")]
          .trim()
          .toUpperCase();
        if (this.filterState[key] !== "") {
          empty = false;
          let v = this.ouvriers$;
          this.ouvriers$ = v.filter(d => {
            return d[key].includes(this.filterState[key]);
          });
        }
      });
    if (!init && !empty) {
      this.a = 0;
      this.b = this.navPas;
      this.position = 1;
    }
    this.ouvriers = this.ouvriers$;
    /*  this.ouvriers = this.ouvriers$.slice(this.a, this.b);
    this.size = Math.trunc(this.ouvriers$.length / this.navPas);
    if (this.size < this.ouvriers$.length / this.navPas)
      this.size = this.size + 1;*/
    if (this.typeAsc !== "") this.onSort(this.typeAsc, true);
  }
  onSort(type, init) {
    // descending order z->a
    console.log(this.ascendant, "  ", this.typeAsc);
    if (!init) {
      this.typeAsc = type;
      this.ascendant[this.typeAsc] = !this.ascendant[this.typeAsc];
    }

    if (!this.ascendant[this.typeAsc])
      this.ouvriers = this.ouvriers.sort((a, b) => {
        if (a[this.typeAsc] > b[this.typeAsc]) {
          return -1;
        }
        if (b[this.typeAsc] > a[this.typeAsc]) {
          return 1;
        }
        return 0;
      });
    if (this.ascendant[this.typeAsc])
      this.ouvriers = this.ouvriers.sort((a, b) => {
        if (a[this.typeAsc] < b[this.typeAsc]) {
          return -1;
        }
        if (b[this.typeAsc] < a[this.typeAsc]) {
          return 1;
        }
        return 0;
      });
  }
  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      this.b = this.navPas * this.position;
      this.a = this.b - this.navPas;
      this.ouvriers = this.ouvriers$.slice(this.a, this.b);
      this.onSort(this.typeAsc, true);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      this.a = this.navPas * this.position;
      this.position = this.position + 1;
      this.b = this.a + this.navPas;
      this.ouvriers = this.ouvriers$.slice(this.a, this.b);
      this.onSort(this.typeAsc, true);
    }
  }

  /**FILTER**/
  getFile(event) {
    this.ficheOuvrierService.onImportExcelFileOuvrier(event.target.files[0]);
  }
  addFormIsDirty(i) {
    let isDirty = false;
    this.columnOuvrier.forEach((key: string) => {
      if (this.form.controls[key.concat(i)].dirty) {
        isDirty = true;
      }
    });
    return isDirty;
  }
  addFormReset() {
    this.columnOuvrier.forEach((key: any) => this.form.controls[key].reset());
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.

    this.store.dispatch(
      new fromFicheOuvrierAction.getOuvListState({
        position: {
          a: this.a,
          b: this.b,
          position: this.position
        },
        filter: this.filterState,
        sort: {
          order: this.ascendant,
          type: this.typeAsc
        }
      })
    );
  }
}
