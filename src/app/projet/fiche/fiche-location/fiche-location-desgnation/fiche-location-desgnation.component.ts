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
  selector: "app-fiche-location-desgnation",
  templateUrl: "./fiche-location-desgnation.component.html",
  styleUrls: ["./fiche-location-desgnation.component.scss"]
})
export class FicheLocationDesgnationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  isSelected: Boolean = false;
  isSelectedDirty = false;
  typeAsc = "";
  duration;
  Show = true;
  columnDesignation: string[] = [
    "DESIGNATION",
    "UNITÉ",
    "DEBUT",
    "FIN",
    "QUANTITÉ",
    "FOURNISSEUR",
    "OBSERVATION"
  ];
  formNames = [
    "libelle",
    "unite",
    "tempsDebut",
    "tempsFin",
    "quantite",
    "fournisseurNom",
    "observation"
  ];
  uniteOnUpdate: string;
  dsIndex;
  dsIndexSelected;
  dsID = -1;
  isFocus = false;
  fournisseurMaterielMap: FournisseurModel[];
  fournisseurMaterielMap$: FournisseurModel[];

  designtions;
  designtions$;

  fournisseurs: FournisseurModel[];
  fournisseurs$: FournisseurModel[];

  fournisseursUpdate: FournisseurModel[];

  materielsShow: MaterielModel[];
  materielsShow$: MaterielModel[];

  FicheLocation: FicheModel;

  locDsToDelete = -1;

  isUpdate = -1;
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
    this.ficheLocationService.onGetFournisseurByProjet();
    this.store.select("ficheLocation").subscribe(state => {
      this.fournisseurMaterielMap$ = [...state.fournisseurByProjet];
    });
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
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "LOCATION" || state === "fiche") {
          this.ficheService.validerFiche(this.FicheLocation.id, "locations");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }

  OnAddLocationDesignation() {
    this.isUpdate = -1;

    var startTime = moment(this.form.value["tempsDebut"], "HH:mm:ss");
    var endTime = moment(this.form.value["tempsFin"], "HH:mm:ss");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asMinutes();
    if (Number.isNaN(duration)) duration = 0;

    let locDs: locationDesignationModel = {
      id: null,
      fournisseurId: this.fournisseurMaterielMap$.find(
        f => f.fournisseurNom === this.form.value["fournisseurNom"]
      ).id,

      idMateriel: this.fournisseurMaterielMap$.find(
        f => f.materiel.designation === this.form.value["libelle"]
      ).materiel.id,
      quantite: 1,
      tempsDebut: this.form.value["tempsDebut"],
      tempsFin: this.form.value["tempsFin"],
      travailleLoc: +(duration / 60).toFixed(2),
      observation: this.form.value["observation"],
      idFiche: null,
      fournisseurNom: "",
      libelle: "",
      idProjet: null
    };
    this.ficheLocationService.onAddLocationDesignation(locDs);
    this.form.controls["fournisseurNom"].disable();
    this.onResetAdd();
  }

  OnUpdateLocationDesignation() {
    this.isUpdate = -1;
    var startTime = moment(
      this.form.value["tempsDebut".concat(this.dsID.toString())],
      "HH:mm:ss"
    );
    var endTime = moment(
      this.form.value["tempsFin".concat(this.dsID.toString())],
      "HH:mm:ss"
    );

    // calculate total duration
    let duration: number = moment.duration(endTime.diff(startTime)).asMinutes();
    if (Number.isNaN(duration)) duration = 0;

    let locDs: locationDesignationModel = {
      id: null,
      fournisseurId: this.fournisseurMaterielMap$.find(
        f =>
          f.fournisseurNom ===
          this.form.value["fournisseurNom".concat(this.dsID.toString())]
      ).id,
      idMateriel: this.fournisseurMaterielMap$.find(
        f =>
          f.materiel.designation ===
          this.form.value["libelle".concat(this.dsID.toString())]
      ).materiel.id,

      quantite: 1,
      tempsDebut: this.form.value["tempsDebut".concat(this.dsID.toString())],
      tempsFin: this.form.value["tempsFin".concat(this.dsID.toString())],
      travailleLoc: +(duration / 60).toFixed(2),
      observation: this.form.value["observation".concat(this.dsID.toString())],
      fournisseurNom: "",
      libelle: "",
      idFiche: null,
      idProjet: null
    };
    console.log("ddd", locDs);
    this.ficheLocationService.onUpdateLocationDesignation(
      locDs,
      this.designtions$[this.dsIndex].id
    );
    this.dsID = -1;
  }

  //the add inputs

  onFocusInputSearch(list) {
    this.isFocus = true;
    this.isSelected = false;
    list.hidden = false;
  }

  OnSelectMateriel(mat) {
    this.isSelected = true;
    this.isSelectedDirty = true;
    this.form.controls["fournisseurNom"].enable();
    this.fournisseurs = this.fournisseurMaterielMap$.filter(
      fm => fm.materiel.id === mat.id
    );

    this.form.controls["libelle"].setValue(mat.designation);
    this.form.controls["unite"].setValue(mat.unite);
    this.form.controls["idArticle"].setValue(mat.id);
  }

  onBlurInputSearch(list) {
    setTimeout(() => {
      if (!this.isSelected) {
        this.form.controls["libelle"].setValue("");
        this.form.controls["unite"].setValue("");
      }
      list.hidden = true;
    }, 100);
  }
  OnSearch(value) {
    if (value.trim() !== "") {
      this.materielsShow = this.materielsShow$.filter(m => {
        return m.designation.toLowerCase().includes(value.toLowerCase());
      });
    } else this.materielsShow = this.materielsShow$;
  }

  onAddClickOutside() {
    console.log(this.isUpdate);
    if (this.isUpdate == 0 && (this.form.dirty || this.isSelectedDirty)) {
      this.isUpdate = -1;
      this.isSelectedDirty = false;
      let submit = true;
      var startTime = moment(this.form.value["tempsDebut"], "HH:mm:ss");
      var endTime = moment(this.form.value["tempsFin"], "HH:mm:ss");

      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime)).asMinutes();
      if (duration <= 0) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "locDs",
            showAlert: true,
            msg: "la date debut doit etre inferieur a la date de fin"
          })
        );
        this.form.controls["tempsDebut"].setValue("");
        this.form.controls["tempsFin"].setValue("");
        this.isUpdate = -1;
      } else {
        this.formNames.forEach((key: any) => {
          if (this.form.value[key] !== null) {
            if (!this.form.controls[key].valid) {
              this.store.dispatch(
                new fromFicheAction.ShowFicheAlert({
                  type: "locDs",
                  showAlert: true,
                  msg: "le champs [ " + key + " ] est invalid!"
                })
              );
              submit = false;
            }
          }
        });
        if (submit) this.form.ngSubmit.emit();
      }
    }
  }
  onSelectAddFr(fr) {
    this.isSelectedDirty = true;
    this.form.controls["fournisseurNom"].setValue(fr);
  }

  onBlurAddFr(listfr) {
    setTimeout(() => {
      listfr.hidden = true;
    }, 100);
  }

  onAddClick() {
    this.isUpdate = 0;
    this.dsIndex = -1;
    if (this.fournisseurMaterielMap$ === null) {
      this.fournisseurMaterielMap$ = [];
    }

    let tabAr = this.fournisseurMaterielMap$.map(f => f.materiel);

    if (tabAr.length > 0) {
      let c = tabAr[0].designation;
      let i = 0;
      tabAr = tabAr.sort((a, b) => {
        if (a.designation < b.designation) {
          return -1;
        }
        if (a.designation > b.designation) {
          return 1;
        }
        return 0;
      });
      this.materielsShow = tabAr.filter(a => {
        if (c === a.designation) {
          i = i + 1;
          if (i > 1) return false;
          else return true;
        } else {
          c = a.designation;
          i = 1;
          return true;
        }
      });
      this.materielsShow$ = [...this.materielsShow];
    }
  }

  ////////////////////////////////////////the update input

  onBlurUpdateInputSearch(list, i, id) {
    setTimeout(() => {
      if (!this.isSelected) {
        this.form.controls["libelle".concat(id.toString())].setValue(
          this.designtions$[i].libelle
        );
        this.form.controls["unite".concat(id.toString())].setValue(
          this.designtions$[i].unite
        );
      }
      list.hidden = true;
    }, 100);
  }

  onFocusUpdateInputSearch(list, value) {
    this.Show = true;
    this.isSelected = false;
    list.hidden = false;
  }
  OnSearchUpdate(value) {
    if (value.trim() !== "")
      this.materielsShow = this.materielsShow$.filter(m => {
        return m.designation.toLowerCase().includes(value.toLowerCase());
      });
    else this.materielsShow = this.materielsShow$;
  }

  OnSelectUpdate(mat, i, id) {
    this.isSelectedDirty = true;
    this.isSelected = true;
    this.form.controls["libelle".concat(id.toString())].setValue(
      mat.designation
    );
    this.form.controls["unite".concat(id.toString())].setValue(mat.unite);

    this.fournisseurs = this.fournisseurMaterielMap$.filter(fm => {
      return fm.materiel.id === mat.id;
    });
    if (
      !this.fournisseurs
        .map(f => f.fournisseurNom)
        .includes(this.FicheLocation.designations[i].fournisseurNom)
    ) {
      this.Show = false;
      this.form.controls["fournisseurNom".concat(mat.id.toString())].reset();
    }
  }

  onUpdateClickedOutside(i, id) {
    if (this.dsID === id) {
      if (this.isUpdate == 1 && (this.form.dirty || this.isSelectedDirty)) {
        this.isSelectedDirty = false;
        let submit = true;
        var startTime = moment(
          this.form.value["tempsDebut".concat(id.toString())],
          "HH:mm:ss"
        );
        var endTime = moment(
          this.form.value["tempsFin".concat(id.toString())],
          "HH:mm:ss"
        );

        // calculate total duration
        var duration = moment.duration(endTime.diff(startTime)).asMinutes();

        if (duration <= 0) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "locDs",
              showAlert: true,
              msg: "la date debut doit etre inferieur a la date de fin"
            })
          );
          this.form.controls["tempsDebut".concat(id.toString())].setValue(
            this.designtions$[i].tempsDebut
          );
          this.form.controls["tempsFin".concat(id.toString())].setValue(
            this.designtions$[i].tempsFin
          );
          this.isUpdate = -1;
        } else {
          let foursName = this.fournisseurs.map(f => f.fournisseurNom);
          if (
            !foursName.includes(
              this.form.value["fournisseurNom".concat(id.toString())]
            ) &&
            this.form.value["fournisseurNom".concat(id.toString())] !==
              this.designtions$[i].fournisseurNom
          ) {
            submit = false;
          }
          if (submit) this.form.ngSubmit.emit();
          else {
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "locDs",
                showAlert: true,
                msg: "Un champs des champs est invalide!  "
              })
            );
            this.formNames.forEach((key: any) => {
              this.form.controls[key.concat(id.toString())].setValue(
                this.designtions$[i][key]
              );
            });
          }
          this.isSelectedDirty = false;
        }
        this.isUpdate = -1;
      } else {
        this.isUpdate = -1;
        this.dsIndex = -1;
        this.dsID = -1;
      }

      this.formNames.forEach((key: any) => {
        this.form.controls[key.concat(id.toString())].disable();
      });
    }
  }

  concat(a: string, b: number) {
    return a.concat(b.toString());
  }

  onUpdateClick(i, id, value, locDs: locationDesignationModel) {
    if (this.isUpdate !== 1) {
      this.dsID = id;
      this.dsIndex = i;
      if (typeof this.form !== "undefined")
        this.formNames.forEach((key: string) => {
          console.log(this.form.controls);
          this.form.controls[key.concat(id)].enable();
        });

      this.isUpdate = 1;
      if (this.FicheLocation.designations === null) {
        this.designtions$ = [];
      }

      //remove double
      this.fournisseurMaterielMap = this.fournisseurMaterielMap$.filter(fa => {
        let pass = true;
        this.designtions$.forEach((ds: locationDesignationModel) => {
          if (fa.materiel.designation === ds.libelle) {
            pass = false;
          }
        });
        return pass;
      });

      let tabAr = this.fournisseurMaterielMap$
        .map(f => f.materiel)
        .filter(m => m.designation !== locDs.libelle);

      if (tabAr.length > 0) {
        let c = tabAr[0].designation;
        let i = 0;
        tabAr = tabAr.sort((a, b) => {
          if (a.designation < b.designation) {
            return -1;
          }
          if (a.designation > b.designation) {
            return 1;
          }
          return 0;
        });
        this.materielsShow = tabAr.filter(a => {
          let is;
          if (c === a.designation) {
            i = i + 1;
            if (i > 1) return false;
            else return true;
          } else {
            c = a.designation;
            i = 1;
            return true;
          }
        });
        this.materielsShow$ = [...this.materielsShow];
      }

      this.fournisseurs$ = this.fournisseurMaterielMap$.filter(fm => {
        let pass = true;
        if (
          fm.fournisseurNom === locDs.fournisseurNom &&
          fm.materiel.designation === locDs.libelle
        ) {
          pass = false;
        }

        this.fournisseurs = this.fournisseurs$;

        return pass && fm.materiel.designation === value;
      });
    }
  }
  onSelectUpdateFr(fournisseurNom, i, id) {
    this.isSelectedDirty = true;
    this.form.controls["fournisseurNom".concat(id.toString())].setValue(
      fournisseurNom
    );
  }
  OnSearchFournisseur(value) {
    if (value.trim() !== "") {
      this.fournisseurs = this.fournisseurs$.filter(m => {
        return m.fournisseurNom.toLowerCase().includes(value.toLowerCase());
      });
    } else this.fournisseurs = this.fournisseurs$;
  }

  onUpdateFournisseurFocus(value, listfrUpdate) {
    listfrUpdate.hidden = false;
  }

  onUpdateFournisseurBlur(listfrUpdate) {
    setTimeout(() => {
      listfrUpdate.hidden = true;
    }, 100);
  }

  /*************** */
  OnCalculeQt(dateDebut, dateFin) {
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
  OnDeleteDs(id) {
    console.log("OnDeleteDs");
    this.locDsToDelete = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "locDs",
        showAlert: true,
        msg: "est ce que vous voulez vraiment supprimer cette designation?"
      })
    );
  }
  OnInputDate(debut, fin, i = "") {
    if (debut !== null && fin !== null) {
      var startTime = moment(debut, "HH:mm:ss");
      var endTime = moment(fin, "HH:mm:ss");

      // calculate total duration
      let duration: number = moment
        .duration(endTime.diff(startTime))
        .asMinutes();

      if (Number.isNaN(duration)) duration = 0.0;

      // duration in hours

      if (i !== "")
        this.designtions$[i].travailleLocString = +(duration / 60).toFixed(2);
      else this.form.controls["quantite"].setValue(+(duration / 60).toFixed(2));
    } else {
      if (i !== "") this.designtions$[i].travailleLocString = "0.0";
      else this.form.controls["quantite"].setValue("0.0");
    }
  }

  /* */

  onFilterBur(input) {
    if (input.value.trim() === "") {
      this.designtions$ = this.designtions$;
      this.designtions = this.designtions$; /*.slice(0, this.navPas);
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

    this.designtions = this.designtions$;
    this.designtions.forEach((d: locationDesignationModel, i) => {
      this.OnInputDate(d.tempsDebut, d.tempsFin, (i = i));
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

  onCtnAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "locDs",
        showAlert: false,
        msg: ""
      })
    );
    if (this.locDsToDelete !== -1)
      this.ficheLocationService.OnDeleteLocationDesignation(this.locDsToDelete);
    this.locDsToDelete = -1;
  }

  onHideAlert() {
    this.locDsToDelete = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "locDs",
        showAlert: false,
        msg: ""
      })
    );
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

  onResetAdd() {
    this.formNames.forEach((key: any) => {
      this.form.controls[key].reset();
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
