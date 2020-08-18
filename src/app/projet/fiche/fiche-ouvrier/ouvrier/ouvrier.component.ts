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
import {
  stateListOuvrier,
  villeOrQualOrApprecAdded,
  ouvState
} from "../redux/fiche-ouvrier.selector";
import { Platform } from "@ionic/angular";
import * as _ from "lodash";
import { refresh } from "../../header/head.selector";
import { innerHeight } from "src/app/projet/redux/projet.selector";

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
  isFocus = false;
  isFocus$ = false;

  projetSelectionnerId;
  ouvriers: OuvrierModel[];
  columnOuvrier: String[] = [
    "appreciation",
    "tele",
    "J_TRV",
    "ancienter",
    "age",
    "qual",
    "ville",
    "prenom",
    "nom",
    "cin"
  ];
  qualifications: String[];
  qualifications$: String[];
  villes: string[];
  villes$: string[];
  apprecs: string[];
  apprecs$: string[];
  hasError: Boolean = false;
  errorMsg = "Erreur!";
  listerOuvrier: Boolean;
  isUpdate = -1;
  focusID = -1;
  ouvSl = -1;
  ouvToDelete = -1;
  up = false;
  ouvrierRemovingId = -1;
  qualOrVilleOrApprecIsSelected = false;
  qualificationToAdd = "";
  villeToAdd = "";
  ApprecToAdd = "";
  dateAgeMax;
  DateAcntMax;
  ouvriers$ = [];
  ouvriers$$ = [];
  order = [];
  typeAsc = "";
  isValid;
  showAlert;
  qualificationToDelete = "";
  apprecToDelete = "";
  villeToDelete = "";
  navPas = 3;
  position = 1;
  a = 0;
  b = this.navPas;
  size;
  inputSearchName = ["cin", "nom", "prenom", "qualification", "appreciation"];
  filterState;
  screenHeight = "200px";
  constructor(
    private ficheOuvrierService: FicheOuvrierService,
    private store: Store<App.AppState>,
    private platform: Platform
  ) {
    this.store.select(innerHeight).subscribe(state => {
      this.screenHeight = (state.innerHeight * 0.5).toString().concat("px");
    });
  }

  ngOnInit() {
    this.dateAgeMax = moment()
      .subtract(18, "years")
      .format("YYYY-MM-DD");
    this.DateAcntMax = moment().format("YYYY-MM-DD");

    this.ficheOuvrierService.onGetQualifications();
    this.ficheOuvrierService.onGetVilles();
    this.ficheOuvrierService.onGetAppreciations();
    this.ficheOuvrierService.onGetOuvriers();

    this.store
      .select(villeOrQualOrApprecAdded)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (this.ouvSl != -1) {
          this.isUpdate = 1;
          this.onUpdateClickedOutside(this.ouvSl);
        }
      });

    this.store
      .select(stateListOuvrier)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.filterState = state.filter;
        this.order = state.sort.order;
        this.typeAsc = state.sort.type;
        this.onFilter(true);
      });

    this.store
      .select(ouvState)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.qualifications$ = state.qualifications;
        this.qualifications = [...this.qualifications$];
        this.villes$ = state.villes;
        this.villes = [...this.villes$];
        this.apprecs$ = state.appreciations;
        this.apprecs = [...this.apprecs$];

        if (state.ouvriers !== null) this.ouvriers$$ = state.ouvriers;

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
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "OUVRIER") {
          this.order.forEach(e => {
            e.isFocus = false;
            e.order = true;
          });

          this.store.dispatch(
            new fromFicheOuvrierAction.getOuvListState({
              filter: this.filterState,
              sort: {
                order: this.order,
                type: this.typeAsc
              }
            })
          );
          this.ficheOuvrierService.onGetQualifications();
          this.ficheOuvrierService.onGetVilles();
          this.ficheOuvrierService.onGetAppreciations();
          this.ficheOuvrierService.onGetOuvriers();
        }
      });
  }

  OnAddOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin"],
      nom: this.form.value["nom"],
      prenom: this.form.value["prenom"],
      qualification: this.form.value["qual"],
      ville: this.form.value["ville"],
      dateNaissance: this.form.value["age"],
      dateRecrutement: this.form.value["ancienter"],
      j_trv: null,
      tele: this.form.value["tele"],
      appreciation: this.form.value["appreciation"],
      isAsso: null
    };
    this.isUpdate = -1;
    this.ficheOuvrierService.OnSaveOuvrier(ouvrier);
    this.qualOrVilleOrApprecIsSelected = false;
    this.addFormReset();
  }
  OnUpdateOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin".concat(this.ouvSl.toString())],
      nom: this.form.value["nom".concat(this.ouvSl.toString())],
      prenom: this.form.value["prenom".concat(this.ouvSl.toString())],
      ville: this.form.value["ville".concat(this.ouvSl.toString())],
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
    this.ficheOuvrierService.OnUpdateOuvrier(ouvrier, this.ouvSl);
    this.columnOuvrier.forEach((key: any) => {
      this.form.controls[key.concat(this.ouvSl.toString())].disable();
    });
    this.ouvSl = -1;
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
  onVilleSearch(value: string) {
    let v = value.trim().toUpperCase();
    if (v == "") this.villes = [...this.villes$];
    else this.villes = this.villes$.filter(q => q.includes(v));
  }
  onApprecSearch(value: string) {
    let v = value.trim().toUpperCase();
    if (v == "") this.apprecs = [...this.apprecs$];
    else this.apprecs = this.apprecs$.filter(q => q.includes(v));
  }

  onAddClickOutside() {
    if (
      this.isUpdate === 0 &&
      (this.FormIsDirty("") || this.qualOrVilleOrApprecIsSelected)
    ) {
      let submit = true;
      this.qualificationToAdd =
        this.form.controls["qual"].value === null
          ? ""
          : this.form.controls["qual"].value.trim().toUpperCase();
      this.villeToAdd =
        this.form.controls["ville"].value === null
          ? ""
          : this.form.controls["ville"].value.trim().toUpperCase();
      this.ApprecToAdd =
        this.form.controls["appreciation"].value === null
          ? ""
          : this.form.controls["appreciation"].value.trim().toUpperCase();
      if (
        !this.qualifications.includes(this.qualificationToAdd) &&
        this.qualificationToAdd != ""
      ) {
        this.qualOrVilleOrApprecIsSelected = false;
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
      } else if (
        !this.villes.includes(this.villeToAdd) &&
        this.villeToAdd != ""
      ) {
        this.qualificationToAdd = "";

        this.qualOrVilleOrApprecIsSelected = false;
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "ouvrier",
            msg:
              "Est ce que vous voulais ajouté la ville [ " +
              this.villeToAdd +
              " ] ?"
          })
        );
      } else if (
        !this.apprecs.includes(this.ApprecToAdd) &&
        this.ApprecToAdd != ""
      ) {
        this.villeToAdd = "";
        this.qualificationToAdd = "";

        this.qualOrVilleOrApprecIsSelected = false;
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "ouvrier",
            msg:
              "Est ce que vous voulais ajouté l' appreciation [ " +
              this.ApprecToAdd +
              " ] ?"
          })
        );
      } else {
        this.columnOuvrier.forEach((key: any) => {
          if (this.form.value[key] !== null) {
            if (this.form.controls[key].invalid) {
              submit = false;
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
      setTimeout(() => {
        this.isUpdate = 0;
        this.ouvSl = -1;
      }, 0);
    }
  }

  onSelectQualification(qual) {
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["qual"].setValue(qual);
  }
  onSelectVille(v) {
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["ville"].setValue(v);
  }

  onSelectApprec(apprec) {
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["appreciation"].setValue(apprec);
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
  onLongPressVille(ville) {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: true,
        type: "ouvrier",
        msg: "Vous Etes sur de vouloire supprimer la ville [ " + ville + " ]?"
      })
    );
    this.villeToDelete = ville;
  }
  onLongPressApprec(apprec) {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: true,
        type: "ouvrier",
        msg:
          "Vous Etes sur de vouloire supprimer l' appreciation [ " +
          apprec +
          " ]?"
      })
    );
    this.apprecToDelete = apprec;
  }

  onUpdateClick(i) {
    this.isUpdate = 1;
    this.columnOuvrier.forEach((key: any) => {
      this.form.controls[key.concat(i.toString())].enable();
    });
    setTimeout(() => {
      this.ouvSl = i;
      this.focusID = i;
    }, 0);

    setTimeout(() => {
      this.addOuvToProjet$ = false;
    }, 200);
  }
  onUpdateClickedOutside(id) {
    if (this.ouvSl === id) {
      let submit = true;
      this.addOuvToProjet$ = true;
      this.focusID = -1;

      if (
        this.isUpdate === 1 &&
        (this.FormIsDirty(id) || this.qualOrVilleOrApprecIsSelected)
      ) {
        this.qualOrVilleOrApprecIsSelected = false;

        //QUAL
        this.qualificationToAdd =
          this.form.controls["qual".concat(id)].value === null
            ? ""
            : this.form.controls["qual".concat(id)].value.trim().toUpperCase();
        //VILLE
        this.villeToAdd =
          this.form.controls["ville".concat(id)].value === null
            ? ""
            : this.form.controls["ville".concat(id)].value.trim().toUpperCase();
        //APREC
        this.ApprecToAdd =
          this.form.controls["appreciation".concat(id)].value === null
            ? ""
            : this.form.controls["appreciation".concat(id)].value
                .trim()
                .toUpperCase();
        if (
          !this.qualifications.includes(this.qualificationToAdd) &&
          this.qualificationToAdd != ""
        ) {
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
        } else if (
          !this.villes.includes(this.villeToAdd) &&
          this.villeToAdd != ""
        ) {
          this.qualificationToAdd = "";
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg:
                "Est ce que vous voulais ajouté la ville [ " +
                this.villeToAdd +
                " ] ?"
            })
          );
        } else if (
          !this.apprecs.includes(this.ApprecToAdd) &&
          this.ApprecToAdd != ""
        ) {
          this.qualificationToAdd = "";
          this.villeToAdd = "";

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "ouvrier",
              msg:
                "Est ce que vous voulais ajouté l' appreciation [ " +
                this.ApprecToAdd +
                " ] ?"
            })
          );
        } else {
          this.columnOuvrier.forEach((key: any) => {
            if (this.form.value[key.concat(id)] !== null) {
              if (this.form.controls[key.concat(id)].invalid) {
                submit = false;
              }
            }
          });

          if (submit) {
            this.OnUpdateOuvrier();
          } else {
            this.UpdateFormRollback(id);
            this.ouvSl = -1;
            this.isUpdate = -1;
          }
        }
      }
      this.columnOuvrier.forEach((key: any) => {
        this.form.controls[key.concat(id.toString())].disable();
      });
    }
  }

  onFocusQualificationInput(list) {
    list.hidden = false;
  }
  onFocusVilleInput(list) {
    list.hidden = false;
  }
  onFocusApprecInput(list) {
    list.hidden = false;
  }
  onBlurQualificationInput(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 300);
  }
  onBlurVilleInput(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 300);
  }
  onBlurApprecInput(list) {
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
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["qual".concat(id.toString())].setValue(item);
  }
  onSelectVilleUpdate(item, id: number) {
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["ville".concat(id.toString())].setValue(item);
  }
  onSelectApprecUpdate(item, id: number) {
    this.qualOrVilleOrApprecIsSelected = true;
    this.form.controls["appreciation".concat(id.toString())].setValue(item);
  }

  onLongPress(ouvId) {
    if (this.focusID == ouvId) {
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          showAlert: true,
          type: "ouvrier",
          msg: "Vous Etes sur de vouloire supprimer l' ouvrier?"
        })
      );
      this.ouvToDelete = ouvId;
    }
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
    if (!_.isEqual(this.ouvriers, this.ouvriers$)) {
      this.ouvriers = this.ouvriers$;
      this.onSortByEnGras();
    }
   
  }
  orderByType(type) {
    return this.order.find(s => s.type === type).order;
  }
  orderTypeFocus(type) {
    return this.order.find(s => s.type === type).isFocus;
  }

  onSortByEnGras() {
    // descending order z->a
    if (this.ouvriers !== null)
      this.ouvriers = this.ouvriers.sort((a: OuvrierModel, b) => {
        if (a.isAsso) {
          return -1;
        } else if (b.isAsso) {
          return 1;
        } else return 0;
      });
  }

  onSort(type, init) {
    // descending order z->a
    let o = this.order.find(s => s.type === type).order;
    if (!init) {
      o = !o;
      this.order.find(s => s.type === type).order = !this.order.find(
        s => s.type === type
      ).order;
      this.order.forEach(e => {
        if (e.type === type) e.isFocus = true;
        else e.isFocus = false;
      });
    }
    if (o)
      this.ouvriers = this.ouvriers.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (b[type] > a[type]) {
          return 1;
        }
        return 0;
      });
    if (!o)
      this.ouvriers = this.ouvriers.sort((a, b) => {
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
  FormIsDirty(i) {
    let isDirty = false;
    this.columnOuvrier.forEach((key: string) => {
      if (this.form.controls[key.concat(i)].dirty) {
        isDirty = true;
      }
    });
    return isDirty;
  }
  addFormReset() {
    this.columnOuvrier.forEach((key: any) => {
      if (this.form.controls[key] !== undefined)
        this.form.controls[key].reset();
    });
  }
  UpdateFormRollback(id) {
    let ds = this.ouvriers$.find(ouv => ouv.id === id);

    this.form.controls["nom".concat(ds.id.toString())].setValue(ds.nom);
    this.form.controls["prenom".concat(ds.id.toString())].setValue(ds.prenom);
    this.form.controls["cin".concat(ds.id.toString())].setValue(ds.cin);
    this.form.controls["ville".concat(ds.id.toString())].setValue(ds.ville);
    this.form.controls["qual".concat(ds.id.toString())].setValue(
      ds.qualification
    );
    this.form.controls["age".concat(ds.id.toString())].setValue(
      ds.dateNaissance
    );
    this.form.controls["ancienter".concat(ds.id.toString())].setValue(
      ds.dateRecrutement
    );
    this.form.controls["J_TRV".concat(ds.id.toString())].setValue(ds.j_trv);
    this.form.controls["tele".concat(ds.id.toString())].setValue(ds.tele);
    this.form.controls["appreciation".concat(ds.id.toString())].setValue(
      ds.appreciation
    );
  }

  onContinue() {
    if (this.villeToAdd !== "") {
      let name = "ville";
      this.ficheOuvrierService.addVille(this.villeToAdd).add;
      if (this.ouvSl !== -1) name = name.concat(this.ouvSl.toString());
      this.form.controls[name].setValue(this.villeToAdd.trim().toUpperCase());

      this.qualOrVilleOrApprecIsSelected = true;
      this.villeToAdd = "";
    } else if (this.ApprecToAdd !== "") {
      let name = "appreciation";
      if (this.ouvSl !== -1) name = name.concat(this.ouvSl.toString());
      this.ficheOuvrierService.addApprec(this.ApprecToAdd);
      this.form.controls[name].setValue(this.ApprecToAdd.trim().toUpperCase());
      this.qualOrVilleOrApprecIsSelected = true;
      this.ApprecToAdd = "";
    } else if (this.qualificationToAdd !== "") {
      let name = "qual";
      if (this.ouvSl !== -1) name = name.concat(this.ouvSl.toString());
      this.ficheOuvrierService.addQualification(this.qualificationToAdd);
      this.form.controls[name].setValue(
        this.qualificationToAdd.trim().toUpperCase()
      );
      this.qualOrVilleOrApprecIsSelected = true;
      this.qualificationToAdd = "";
    } else if (this.ouvToDelete !== -1) {
      this.ficheOuvrierService.OnDeleteOuvrier(this.ouvToDelete);
      this.ouvToDelete = -1;
    } else if (this.qualificationToDelete != "") {
      this.ficheOuvrierService.OnDeleteQualification(
        this.qualificationToDelete
      );
      this.qualificationToDelete = "";
    } else if (this.apprecToDelete != "") {
      this.ficheOuvrierService.OnDeleteApprec(this.apprecToDelete);
      this.apprecToDelete = "";
    } else if (this.villeToDelete != "") {
      this.ficheOuvrierService.OnDeleteVille(this.villeToDelete);
      this.villeToDelete = "";
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
    if (this.ouvSl !== -1) this.UpdateFormRollback(this.ouvSl);
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "ouvrier",
        msg: ""
      })
    );
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.

    this.order.forEach(e => {
      e.isFocus = true;
      e.order = true;
    });

    this.store.dispatch(
      new fromFicheOuvrierAction.getOuvListState({
        filter: this.filterState,
        sort: {
          order: this.order,
          type: this.typeAsc
        }
      })
    );
  }
}
