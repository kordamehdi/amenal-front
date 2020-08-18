import { stateFicheOuvrier } from "./../redux/fiche-ouvrier.selector";
import { ouvrierDesignationModel } from "./../../../models/ouvrierDesignation.model";
import { OuvrierModel } from "src/app/projet/models/ouvrier.model";
import { FicheService } from "./../../fiche.service";
import { nextFiche, validerFiche } from "./../../nav/nav.selector";
import { ProjetModel } from "./../../../models/projet.model";
import { Platform } from "@ionic/angular";

import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { FicheOuvrierDesignationService } from "./fiche-ouvrier-designation.service";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import * as moment from "moment";
import { refresh } from "../../header/head.selector";
import { untilDestroyed } from "ngx-take-until-destroy";
import * as fromFicheOuvrierAction from "../redux/fiche-ouvrier.action";
import { fiche, listeAdmin } from "../../redux/fiche.selector";
import { innerHeight, dimension } from "src/app/projet/redux/projet.selector";

@Component({
  selector: "app-fiche-ouvrier-designation",
  templateUrl: "./fiche-ouvrier-designation.component.html",
  styleUrls: ["./fiche-ouvrier-designation.component.scss"]
})
export class FicheOuvrierDesignationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;

  columnDesignation: String[];
  FicheOuvrier: any;
  projetSelectionner: ProjetModel;
  ouvrierCin: String;
  ouvrierQualification: String;
  ouvDsSlIndex: number;
  formNames = [
    "ouv",
    "ouvID",
    "debut",
    "fin",
    "travail",
    "epi",
    "hSup",
    "jour"
  ];
  d = 1;
  formNamesOnUpdate = ["ouv", "debut", "fin", "travail", "epi", "hSup", "jour"];
  formNamesOrder = ["ouv", "debut", "fin", "epi", "hSup", "jour"];

  ready = false;
  designationOuvrier: ouvrierDesignationModel[] = [];
  designationOuvrier$: ouvrierDesignationModel[] = [];
  designationOuvrier$$: ouvrierDesignationModel[] = [];
  //order
  order = [
    {
      type: "nom",
      order: true,
      isFocus: true
    },
    {
      type: "qualification",
      order: true,
      isFocus: false
    },
    {
      type: "tempsDebut",
      order: true,
      isFocus: false
    },
    {
      type: "tempsFin",
      order: true,
      isFocus: false
    },
    {
      type: "tempsDiff",
      order: true,
      isFocus: false
    },
    {
      type: "hsup",
      order: true,
      isFocus: false
    },
    {
      type: "jour",
      order: true,
      isFocus: false
    }
  ];
  type = "nom";
  OuvrierToSelect: OuvrierModel[];
  OuvrierToSelect$: OuvrierModel[];
  SearchByNom = "";
  SearchByQual = "";
  isSelected = false;
  isUpdate = -1;
  showAlert: Boolean = false;
  errorMsg = "Erreur!";
  Trv: string;
  dateFinMax;
  dateAgeMax;
  DateAcntMax;
  navPas = 2;
  position = 1;
  ouvDeleteId = -1;
  size;
  screenHeight: number;
  a = 0;
  b = this.navPas;
  thi;
  stateListdmin = false;
  constructor(
    private ficheService: FicheService,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService,
    private store: Store<App.AppState>,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.store.select(dimension).subscribe(state => {
      if (state.listeAdmin) this.screenHeight = state.innerHeight * 0.5;
      else this.screenHeight = state.innerHeight * 0.95;
    });

    this.ficheOuvrierDesignationService.onGetOuvrierByProjet();

    this.store
      .select("ficheOuvrier")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.columnDesignation = state.columnDesignation;
      });
    this.store
      .select(stateFicheOuvrier)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.a = state.position.a;
        this.b = state.position.b;
        this.position = state.position.position;
        this.SearchByNom = state.filter.nom;
        this.SearchByQual = state.filter.qualification;
        this.order = state.sort.order;
        this.type = state.sort.type;
      });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "fiche-ouvrier-ds" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.projetSelectionner = { ...state.projetSelectionner };

        this.OuvrierToSelect = this.projetSelectionner.ouvriers;
        this.OuvrierToSelect$ = this.projetSelectionner.ouvriers;
      });
    this.store
      .select(fiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.FicheOuvrier = {
          ...state
        };

        if (this.FicheOuvrier.designations.length !== 0)
          this.designationOuvrier$$ = this.FicheOuvrier.designations;

        this.onFilter(true);
      });

    this.store
      .select(nextFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.ouvrierQualification = this.ouvrierCin = "";
        if (this.form != null) this.form.reset();
      });

    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "OUVRIER" || state === "fiche") {
          this.ficheService.validerFiche(this.FicheOuvrier.id, "ouvriers");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
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

  onAddSelectOuvrier(item: OuvrierModel) {
    this.isSelected = true;

    this.form.controls["ouvID"].setValue(item.id);
    this.form.controls["ouv"].setValue(item.nom.concat(" ", item.prenom));
    this.ouvrierCin = item.cin;
    this.ouvrierQualification = item.qualification;
  }

  OnAddOuvrierDesignation() {
    var jour = this.form.value["jour"] === "" ? 0 : this.form.value["jour"];
    var hsup = this.form.value["hSup"] === "" ? 0 : this.form.value["hSup"];
    // calculate total duration

    const ouvDs: ouvrierDesignationModel = {
      id: null,
      idOuvrier: this.form.value["ouvID"],
      nom: "",
      prenom: "",
      qualification: "",
      tempsDiff: "",
      cin: "",
      tempsDebut: this.form.value["debut"],
      tempsFin: this.form.value["fin"],
      epi: this.form.value["epi"],
      hsup: this.form.value["jour"],
      jour: this.form.value["hSup"],
      idFiche: this.FicheOuvrier.id,
      hsupValid: false,
      jourValid: false,
      valid: this.timeException(
        this.form.value["debut"],
        this.form.value["fin"],
        hsup,
        jour
      )
    };

    this.ficheOuvrierDesignationService.OnSaveOuvrierDesignation(ouvDs);
    this.ouvrierQualification = this.ouvrierCin = "";
    this.isSelected = false;
    this.formNames.forEach((key: any) => {
      this.form.controls[key].reset();
    });
  }

  OnUpdateOuvrierDesignation() {
    let dss = this.designationOuvrier$$.find(d => d.id === this.ouvDsSlIndex);

    // calculate total duration
    const ouvDs: ouvrierDesignationModel = {
      id: null,
      idOuvrier: this.form.value["ouvID".concat(this.ouvDsSlIndex.toString())],
      nom: dss.nom,
      prenom: "",
      qualification: dss.qualification,
      cin: dss.cin,
      tempsDebut: this.form.value["debut".concat(this.ouvDsSlIndex.toString())],
      tempsFin: this.form.value["fin".concat(this.ouvDsSlIndex.toString())],
      epi: this.form.value["epi".concat(this.ouvDsSlIndex.toString())],
      hsup: this.form.value["hSup".concat(this.ouvDsSlIndex.toString())],
      jour: this.form.value["jour".concat(this.ouvDsSlIndex.toString())],
      idFiche: this.FicheOuvrier.id,
      tempsDiff: "",
      hsupValid: false,
      jourValid: false,
      valid: this.timeException(
        this.form.value["debut".concat(this.ouvDsSlIndex.toString())],
        this.form.value["fin".concat(this.ouvDsSlIndex.toString())],
        this.form.value["hSup".concat(this.ouvDsSlIndex.toString())],
        this.form.value["jour".concat(this.ouvDsSlIndex.toString())]
      )
    };

    this.ficheOuvrierDesignationService.OnUpdateOuvrierDesignation(
      ouvDs,
      this.ouvDsSlIndex
    );
    this.isSelected = false;
    this.ouvDsSlIndex = -1;
    this.ouvrierQualification = this.ouvrierCin = "";
  }

  /***************** */
  onSearch() {
    let vv = this.form.value["ouv"].trim().toUpperCase();
    if (vv !== "")
      this.OuvrierToSelect = this.OuvrierToSelect$.filter(d => {
        return d.nom.concat(" ", d.prenom).includes(vv);
      });
    else this.OuvrierToSelect = this.OuvrierToSelect$;
  }
  onSearchUpdate(i) {
    let vv = this.form.value["ouv".concat(i)].trim().toUpperCase();
    if (vv !== "")
      this.OuvrierToSelect = this.OuvrierToSelect$.filter(d => {
        return d.nom.concat(" ", d.prenom).includes(vv);
      });
    else this.OuvrierToSelect = this.OuvrierToSelect$;
  }
  onBlurSelectOuvrier(ouvadd, next) {
    setTimeout(() => {
      ouvadd.hidden = true;
      let id = this.form.value["ouvID"];
      let ouv = this.OuvrierToSelect$.find(
        o => o.nom.concat(" ", o.prenom) === this.form.value["ouv"].trim()
      );
      if (ouv == null) {
        this.ouvrierQualification = "";
        this.ouvrierCin = "";
        this.isSelected = false;
      } else if (id !== ouv.id) {
        this.ouvrierQualification = "";
        this.ouvrierCin = "";
        this.isSelected = false;
      }
      this.goToNext(next);
    }, 100);
  }
  onFocusSelectOuvrier(ouvAdd) {
    ouvAdd.hidden = false;
    let vv = this.form.value["ouv"].trim().toUpperCase();
    if (vv !== "")
      this.OuvrierToSelect = this.OuvrierToSelect$.filter(d => {
        return d.nom.concat(" ", d.prenom).includes(vv);
      });
  }
  onClickAdd() {
    setTimeout(() => {
      this.isUpdate = 0;
      this.ouvDsSlIndex = -1;
    }, 0);
  }

  onClickAddOutside() {
    if (this.isUpdate === 0 && (this.form.dirty || this.isSelected)) {
      let submit = true;
      this.isUpdate = -1;

      let debut = this.form.controls["debut"].value;
      let fin = this.form.controls["fin"].value;
      if (!this.calculeDiff(debut, fin)) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            showAlert: true,
            type: "fiche-ouvrier-ds",
            msg: "Date debut doit etre inferieure a la date de Fin!"
          })
        );
      } else {
        this.formNames.forEach((key: any) => {
          if (this.form.controls[key].invalid) submit = false;
        });
        if (submit) {
          this.isSelected = false;
          this.form.ngSubmit.emit();
        }
      }
    }
  }
  /***************** */

  onBlurSelectOuvrierUpdate(ouvadd, ds, next) {
    setTimeout(() => {
      ouvadd.hidden = true;
    }, 100);
    let i = ds.id;
    let id = this.form.value["ouvID".concat(i)];
    let ouv = this.OuvrierToSelect$.find(
      o =>
        o.nom.concat(" ", o.prenom) === this.form.value["ouv".concat(i)].trim()
    );
    if (ouv == null) {
      this.form.controls["ouvID".concat(i)].setValue(ds.idOuvrier);
      this.form.controls["ouv".concat(i)].setValue(ds.nom);
      this.form.controls["cin".concat(i)].setValue(ds.cin);
      this.form.controls["qualification".concat(i)].setValue(ds.qualification);
      this.isSelected = false;
    } else if (id !== ouv.id) {
      this.form.controls["ouvID".concat(i)].setValue(ds.idOuvrier);
      this.form.controls["ouv".concat(i)].setValue(ds.nom);
      this.form.controls["cin".concat(i)].setValue(ds.cin);
      this.form.controls["qualification".concat(i)].setValue(ds.qualification);
      this.isSelected = false;
    }
  }
  onFocusSelectOuvrierUpdate(ouvadd) {
    ouvadd.hidden = false;
  }

  onAddSelectOuvrierUpdate(item: OuvrierModel, i) {
    this.isSelected = true;

    this.form.controls["ouvID".concat(i)].setValue(item.id);
    this.form.controls["ouv".concat(i)].setValue(
      item.nom.concat(" ", item.prenom)
    );
    this.form.controls["cin".concat(i)].setValue(item.cin);
    this.form.controls["qualification".concat(i)].setValue(item.qualification);
  }
  /*********** */
  onLongPress(ouvDsId) {
    if (this.ouvDsSlIndex === ouvDsId) {
      this.ouvDeleteId = ouvDsId;
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          showAlert: true,
          msg: "Vous etes sure de vouloire supprimer cette designation?",
          type: "fiche-ouvrier-ds"
        })
      );
    }
  }

  calculTravail(dateDebut, dateFin) {
    if (dateDebut.trim() !== "" && dateFin.trim() !== "") {
      var startTime = moment(dateDebut, "HH:mm:ss");
      var endTime = moment(dateFin, "HH:mm:ss");

      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));

      // duration in hours
      var hours = duration.asHours();

      // duration in minutes
      var minutes = duration.asMinutes() % 60;

      return Math.trunc(hours) + "H " + minutes + "M";
    } else {
      return "--H --M";
    }
  }

  timeExceptionJour(dateDebut, dateFin, jour) {
    if (dateFin === null || dateFin === "") {
      return false;
    }
    var startTime = moment(dateDebut, "HH:mm:ss");
    var endTime = moment(dateFin, "HH:mm:ss");
    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asHours();
    if (+duration < +jour * 9) return true;
    else return false;
  }
  timeExceptionHsup(dateDebut, dateFin, hsup, jour) {
    if (dateFin === null || dateFin === "") {
      return false;
    }
    var startTime = moment(dateDebut, "HH:mm:ss");
    var endTime = moment(dateFin, "HH:mm:ss");
    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asHours();
    if (+duration > +jour * 9)
      if (+duration < +jour * 9 + +hsup) return true;
      else return false;
    else return true;
  }
  timeException(dateDebut, dateFin, hsup, jour) {
    if (dateFin === null || dateFin === "") {
      return false;
    }
    var startTime = moment(dateDebut, "HH:mm:ss");
    var endTime = moment(dateFin, "HH:mm:ss");
    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asHours();
    if (+duration < +jour * 9)
      if (+duration > +jour * 9 + +hsup) return false;
      else return true;
  }
  onUpdateClick(i) {
    setTimeout(() => {
      this.isUpdate = 1;
      this.ouvDsSlIndex = i;
    }, 0);

    this.formNamesOnUpdate.forEach((key: any) => {
      this.form.controls[key.concat(i.toString())].enable();
    });
  }
  onClickUpdateOutside(id) {
    if (this.ouvDsSlIndex === id) {
      if (this.isUpdate == 1 && (this.form.dirty || this.isSelected)) {
        let submit = true;
        let debut = this.form.controls["debut".concat(id.toString())].value;
        let fin = this.form.controls["fin".concat(id.toString())].value;

        if (!this.calculeDiff(debut, fin)) {
          this.isUpdate = -1;
          this.rollBack(id);
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche-ouvrier-ds",
              msg: "Date Debut debut doit etre inferieure a la date de Fin!"
            })
          );
        } else {
          this.formNamesOnUpdate.forEach((key: any) => {
            if (this.form.controls[key.concat(id.toString())].invalid) {
              submit = false;
              this.store.dispatch(
                new fromFicheAction.ShowFicheAlert({
                  showAlert: true,
                  type: "fiche-ouvrier-ds",
                  msg: "le champs " + key + " est invalide!"
                })
              );
            }
          });
          if (submit) {
            let dss = this.designationOuvrier$$.find(
              d => d.id === this.ouvDsSlIndex
            );

            // calculate total duration
            const ouvDs: ouvrierDesignationModel = {
              id: null,
              idOuvrier: this.form.value[
                "ouvID".concat(this.ouvDsSlIndex.toString())
              ],
              nom: dss.nom,
              prenom: "",
              qualification: dss.qualification,
              cin: dss.cin,
              tempsDiff: "",
              tempsDebut: this.form.value[
                "debut".concat(this.ouvDsSlIndex.toString())
              ],
              tempsFin: this.form.value[
                "fin".concat(this.ouvDsSlIndex.toString())
              ],
              epi: this.form.value["epi".concat(this.ouvDsSlIndex.toString())],
              hsup: this.form.value[
                "hSup".concat(this.ouvDsSlIndex.toString())
              ],
              jour: this.form.value[
                "jour".concat(this.ouvDsSlIndex.toString())
              ],
              hsupValid: false,
              jourValid: false,
              idFiche: this.FicheOuvrier.id,
              valid: this.timeException(
                this.form.value["debut".concat(this.ouvDsSlIndex.toString())],
                this.form.value["fin".concat(this.ouvDsSlIndex.toString())],
                this.form.value["hSup".concat(this.ouvDsSlIndex.toString())],
                this.form.value["jour".concat(this.ouvDsSlIndex.toString())]
              )
            };

            this.ficheOuvrierDesignationService.OnUpdateOuvrierDesignation(
              ouvDs,
              this.ouvDsSlIndex
            );
            this.isSelected = false;
            this.ouvDsSlIndex = -1;
            this.ouvrierQualification = this.ouvrierCin = "";
          } else {
            this.ouvDsSlIndex = -1;
          }
        }
      }
      this.ouvDsSlIndex = -1;

      this.formNamesOnUpdate.forEach((key: any) => {
        this.form.controls[key.concat(id.toString())].disable();
      });
    }
  }
  /*** */

  calculeDiff(debut, fin) {
    var startTime = moment(debut, "HH:mm:ss");
    var endTime = moment(fin, "HH:mm:ss");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asHours();

    if (duration < 0) return false;
    else return true;
  }

  onTrsDoubleToDate(min: number, u) {
    if (u === "H") {
      var hours = Math.floor(min / 60);
      var minutes = (min % 60) / 60;
      return hours + minutes;
    } else return min;
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
    this.designationOuvrier = this.designationOuvrier$;
    this.onSort(true, "nom");

    /*if (!init && (this.SearchByNom !== "" || this.SearchByQual !== "")) {
      this.a = 0;
      this.b = this.navPas;
      this.position = 1;
    }
    this.designationOuvrier = this.designationOuvrier$.slice(this.a, this.b);
    this.size = Math.trunc(this.designationOuvrier$.length / this.navPas);
    if (this.size < this.designationOuvrier$.length / this.navPas)
      this.size = this.size + 1;
    this.onSort(true);*/
  }

  orderByType(type) {
    return this.order.find(s => s.type === type).order;
  }
  orderTypeFocus(type) {
    return this.order.find(s => s.type === type).isFocus;
  }

  onSort(init, type) {
    this.type = type;
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
      this.designationOuvrier = this.designationOuvrier.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (b[type] > a[type]) {
          return 1;
        }
        return 0;
      });
    if (!o)
      this.designationOuvrier = this.designationOuvrier.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        }
        if (b[type] < a[type]) {
          return 1;
        }
        return 0;
      });
  }
  slice(Dss) {
    return [...Dss].map(m => JSON.parse(JSON.stringify(m)));
  }

  rollBack(id) {
    let ds = this.designationOuvrier$$.find(d => d.id === id);
    this.form.controls["debut".concat(id.toString())].setValue(
      ds["tempsDebut"]
    );
    this.form.controls["fin".concat(id.toString())].setValue(ds["tempsFin"]);
    this.form.controls["hSup".concat(id.toString())].setValue(ds["hsup"]);
    this.form.controls["jour".concat(id.toString())].setValue(ds["jour"]);
  }
  onDelete() {
    if (this.ouvDeleteId !== -1) {
      this.ficheOuvrierDesignationService.OnDeleteOuvrierDesignation(
        this.ouvDeleteId
      );
      this.ouvDeleteId = -1;
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          showAlert: false,
          msg: ""
        })
      );
    }
  }

  goToNext(next) {
    //  next.focus();
    //  next.click();
  }

  /*******/
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        showAlert: false,
        type: "fiche-ouvrier-ds"
      })
    );
  }
  ngOnDestroy() {
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
        sort: {
          order: this.order,
          type: this.type
        }
      })
    );

    // To protect you, we'll throw an error if it doesn't exist.
  }
}
