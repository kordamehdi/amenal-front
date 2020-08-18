import { validerFiche } from "./../../nav/nav.selector";
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
import * as fromFicheLocationAction from "../redux/fiche-location.action";

import * as moment from "moment";
import { untilDestroyed } from "ngx-take-until-destroy";
import { stateFicheLocation } from "../redux/fiche-location.selector";
import { Platform } from "@ionic/angular";
import { listeAdmin, fiche } from "../../redux/fiche.selector";
import { innerHeight, dimension } from "src/app/projet/redux/projet.selector";

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
  typeAsc = "libelle";
  duration;
  Show = true;
  formNames = [
    "libelle",
    "unite",
    "tempsDebut",
    "tempsFin",
    "quantite",
    "fournisseurNom",
    "brf",
    "observation"
  ];
  uniteOnUpdate: string;
  dsIndex;
  dsIndexSelected;
  dsID = -1;
  isFocus = false;
  fournisseurMaterielMap: FournisseurModel[];
  fournisseurMaterielMap$: FournisseurModel[];
  inputSearchName = ["libelle", "fournisseurNom", "brf"];
  designtions: locationDesignationModel[] = [];
  designtions$: locationDesignationModel[] = [];
  designtions$$: locationDesignationModel[] = [];

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

  a = 0;
  b = this.navPas;
  filterState = {
    libelle: "",
    fournisseurNom: ""
  };
  order = [
    {
      type: "libelle",
      order: true,
      isFocus: false
    },
    {
      type: "tempsFin",
      order: true,
      isFocus: false
    },
    {
      type: "tempsDebut",
      order: true,
      isFocus: false
    },
    {
      type: "travailleLoc",
      order: true,
      isFocus: false
    },
    {
      type: "fournisseurNom",
      order: true,
      isFocus: false
    },
    {
      type: "brf",
      order: true,
      isFocus: false
    }
  ];
  screenHeight;
  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService,
    private ficheService: FicheService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetFournisseurByProjet();

    this.store
      .select(listeAdmin)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        let newHeight;
        if (state) {
          newHeight = ((this.platform.height() - 73) * 0.5)
            .toString()
            .concat("px");
        } else {
          newHeight = ((this.platform.height() - 73) * 0.95)
            .toString()
            .concat("px");
        }

        if (this.screenHeight != newHeight) this.screenHeight = newHeight;
      });

    this.store
      .select(stateFicheLocation)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.filterState = state.filter;
        this.order = state.sort.order;
        this.typeAsc = state.sort.type;
        setTimeout(() => {
          this.onFilter(true);
        }, 0);
      });

    this.store
      .select("ficheLocation")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        setTimeout(() => {
          this.onFilter(true);
        }, 0);
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
      });
    this.store
      .select(fiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        setTimeout(() => {
          if (state !== null) this.FicheLocation = { ...state };

          this.designtions$$ = this.FicheLocation.designations;

          this.onFilter(true);
        }, 0);
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
      unite: null,
      idMateriel: this.fournisseurMaterielMap$.find(
        f => f.materiel.designation === this.form.value["libelle"]
      ).materiel.id,
      quantite: 1,
      tempsDebut: this.form.value["tempsDebut"],
      tempsFin: this.form.value["tempsFin"],
      travailleLoc: +duration,
      observation: this.form.value["observation"],
      brf: this.form.value["brf"],
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
      unite: null,
      idMateriel: this.fournisseurMaterielMap$.find(
        f =>
          f.materiel.designation ===
          this.form.value["libelle".concat(this.dsID.toString())]
      ).materiel.id,

      quantite: 1,
      tempsDebut: this.form.value["tempsDebut".concat(this.dsID.toString())],
      tempsFin: this.form.value["tempsFin".concat(this.dsID.toString())],
      travailleLoc: +duration,
      observation: this.form.value["observation".concat(this.dsID.toString())],
      fournisseurNom: "",
      brf: this.form.value["brf".concat(this.dsID.toString())],
      libelle: "",
      idFiche: null,
      idProjet: null
    };
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

    if (this.fournisseurs.length == 1) {
      this.form.controls["fournisseurNom"].setValue(
        this.fournisseurs[0].fournisseurNom
      );
    }

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
          console.log("*********** ", key);
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
    setTimeout(() => {
      this.isUpdate = 0;
      this.dsIndex = -1;
    }, 0);

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
      if (this.fournisseurs.length == 1)
        this.form.controls["fournisseurNom".concat(mat.id.toString())].setValue(
          this.fournisseurs[0].fournisseurNom
        );
      else
        this.form.controls["fournisseurNom".concat(mat.id.toString())].reset();
    }
  }

  onUpdateClickedOutside(i, id) {
    if (this.dsID === id) {
      if (this.isUpdate == 1 && (this.form.dirty || this.isSelectedDirty)) {
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
          if (this.isSelectedDirty) {
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
        this.isSelectedDirty = false;
      } else {
        this.isUpdate = -1;
        this.dsIndex = -1;
        this.dsID = -1;
      }
      console.log(
        "*************************onUpdateClickedOutside******************"
      );
      this.formNames.forEach((key: any) => {
        this.form.controls[key.concat(id.toString())].disable();
      });
    }
  }

  concat(a: string, b: number) {
    return a.concat(b.toString());
  }

  onUpdateClick(i, id, value, locDs: locationDesignationModel) {
    setTimeout(() => {
      this.dsID = id;
    }, 0);
    this.dsIndex = i;
    console.log("*************************onUpdateClick******************");

    if (typeof this.form !== "undefined")
      this.formNames.forEach((key: string) => {
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
  onSelectUpdateFr(fournisseurNom, id) {
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

  onUpdateFournisseurFocus(listfrUpdate) {
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
    if (this.dsID === id) {
      this.locDsToDelete = id;
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "locDs",
          showAlert: true,
          msg: "est ce que vous voulez vraiment supprimer cette designation?"
        })
      );
    }
  }

  /* */

  onFilter(init) {
    this.designtions$ = this.slice(this.designtions$$);
    let empty = true;

    if (typeof this.form !== "undefined")
      this.inputSearchName.forEach((key: string) => {
        if (typeof this.form.controls[key.concat("$")] !== "undefined") {
          if (init)
            this.form.controls[key.concat("$")].setValue(this.filterState[key]);

          this.filterState[key] = this.form.controls[key.concat("$")].value
            .trim()
            .toUpperCase();
          if (this.filterState[key] !== "") {
            empty = false;
            let v = this.designtions$;
            this.designtions$ = v.filter(d => {
              return d[key].includes(this.filterState[key]);
            });
          }
        }
      });

    if (!init && !empty) {
      this.a = 0;
      this.b = this.navPas;
      this.position = 1;
    }
    this.designtions = this.designtions$;

    /* this.designtions = this.designtions$.slice(this.a, this.b);
    this.size = Math.trunc(this.designtions$.length / this.navPas);
    if (this.size < this.designtions$.length / this.navPas)
      this.size = this.size + 1;*/

    this.onSort(true, this.typeAsc);
  }

  /*********** */
  orderByType(type) {
    return this.order.find(s => s.type === type).order;
  }
  orderTypeFocus(type) {
    return this.order.find(s => s.type === type).isFocus;
  }
  /********** */

  onSort(init, type) {
    // descending order z->a
    this.typeAsc = type;
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
      this.designtions = this.designtions.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        } else if (b[type] > a[type]) {
          return 1;
        } else {
          return b.id < a.id ? 1 : -1;
        }
      });
    if (!o)
      this.designtions = this.designtions.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        } else if (b[type] < a[type]) {
          return 1;
        } else {
          return b.id < a.id ? 1 : -1;
        }
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
  slice(Dss) {
    return [...Dss].map(m => JSON.parse(JSON.stringify(m)));
  }

  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      this.b = this.navPas * this.position;
      this.a = this.b - this.navPas;
      this.designtions = this.designtions$.slice(this.a, this.b);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      this.a = this.navPas * this.position;
      this.position = this.position + 1;
      this.b = this.a + this.navPas;
      this.designtions = this.designtions$.slice(this.a, this.b);
    }
  }

  onResetAdd() {
    this.formNames.forEach((key: any) => {
      this.form.controls[key].reset();
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.

    this.store.dispatch(
      new fromFicheLocationAction.getFicheState({
        filter: this.filterState,
        sort: {
          order: this.order,
          type: this.typeAsc
        }
      })
    );
  }
}
