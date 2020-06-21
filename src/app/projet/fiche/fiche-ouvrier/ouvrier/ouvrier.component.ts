import { Store } from "@ngrx/store";
import { FicheOuvrierService } from "./../fiche-ouvrier.service";
import { OuvrierModel } from "./../../../models/ouvrier.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as App from "../../../../store/app.reducers";
import * as fromFicheOuvrierAction from "./../redux/fiche-ouvrier.action";
import * as fromFicheAction from "../../redux/fiche.action";
import * as moment from "moment";

@Component({
  selector: "app-ouvrier",
  templateUrl: "./ouvrier.component.html",
  styleUrls: ["./ouvrier.component.scss"]
})
export class OuvrierComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;
  isCompleted: boolean = false;
  addOuvToProjet$ = true;
  aaa = true;
  isFocus = false;
  isFocus$ = false;

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
  ouvriers$;
  ouvriers$$;
  ascendant = [];
  typeAsc = "";
  isValid;
  showAlert;
  qualificationToDelete = "";
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
    this.store.select("ficheOuvrier").subscribe(state => {
      this.columnOuvrier = state.columnOuvrier;
      this.qualifications$ = state.qualifications;
      this.qualifications = [...this.qualifications$];
      this.ouvriers = state.ouvriers;
      this.ouvriers$ = state.ouvriers;
      this.ouvriers$$ = state.ouvriers;
      this.isUpdate = state.isOuvrierUpdate;
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "ouvrier") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
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
      idProjets: []
    };
    this.isUpdate = -1;
    this.ficheOuvrierService.OnSaveOuvrier(ouvrier);
    this.qualificationIsSelected = false;
    this.form.reset();
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
      idProjets: []
    };
    this.isUpdate = -1;
    this.focusID = -1;
    this.ficheOuvrierService.OnUpdateOuvrier(ouvrier, this.ouvSl);
    this.form.reset();
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
    if (this.isUpdate === 0 && this.form.dirty) {
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
        this.form.controls["qual"].setValue("");
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
      if ((this.isUpdate === 1 && this.form.dirty) || this.up)
        this.form.ngSubmit.emit();
      else this.focusID = -1;
      this.columnOuvrier.forEach((key: any) => {
        if (this.form.controls[key.concat(i.toString())].enabled) {
          this.form.controls[key.concat(i.toString())].disable();
        }
      });
      this.up = false;
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
    this.onHideAlert();
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "ouvrier",
        msg: ""
      })
    );
  }

  /**FILTER***/
  onFilterFocus(field) {
    this.typeAsc = field;
  }

  onFilterBur(input, type) {
    /* this.ouvriers = this.ouvriers$.slice(0, this.navPas);
      this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
      if (this.size < this.designationOuvrier$.length / this.navPas)
        this.size = this.size + 1;*/
  }

  onFilter() {
    let inputSearchName = [
      "cin",
      "nom",
      "prenom",
      "qualification",
      "appreciation"
    ];
    this.ouvriers$ = this.ouvriers$$;
    inputSearchName.forEach((key: string) => {
      let vv = this.form.value[key.concat("$")].trim().toUpperCase();
      if (vv !== "") {
        let v = this.ouvriers$;
        this.ouvriers$ = v.filter(d => {
          return d[key].includes(vv);
        });
      }
    });

    this.ouvriers = this.ouvriers$;

    /*this.designationOuvrier = this.designationOuvrier$.slice(0, this.navPas);
    this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
    if (this.size < this.designationOuvrier$.length / this.navPas)
      this.size = this.size + 1;*/
  }
  onSort(type) {
    this.typeAsc = type;
    // descending order z->a
    this.ascendant[type] = !this.ascendant[type];
    if (!this.ascendant[type])
      this.ouvriers = this.ouvriers$.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (b[type] > a[type]) {
          return 1;
        }
        return 0;
      });
    if (this.ascendant[type])
      this.ouvriers = this.ouvriers$.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        }
        if (b[type] < a[type]) {
          return 1;
        }
        return 0;
      });
  }
  /**FILTER**/
  getFile(event) {
    this.ficheOuvrierService.onImportExcelFileOuvrier(event.target.files[0]);
  }
}
