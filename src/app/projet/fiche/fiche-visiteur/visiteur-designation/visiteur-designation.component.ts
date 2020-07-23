import { VisiteurDesignationModel } from "./../../../models/fiche-visiteur.model";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { FicheService } from "./../../fiche.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { validerFiche } from "../../nav/nav.selector";
import { untilDestroyed } from "ngx-take-until-destroy";
import { refresh } from "../../header/head.selector";
import { VisiteurDesignationService } from "./visiteur-designation.service";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";
import * as moment from "moment";
import * as fromFicheVisiteurAction from "../redux/fiche-visiteur.action";
import { NgForm } from "@angular/forms";
import { positionFicheVisiteur } from "../redux/fiche-visiteur.selector";

@Component({
  selector: "app-visiteur-designation",
  templateUrl: "./visiteur-designation.component.html",
  styleUrls: ["./visiteur-designation.component.scss"]
})
export class VisiteurDesignationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  errorMsg;
  showAlert;
  ficheVisiteur: FicheModel;
  designation$$: VisiteurDesignationModel[];
  designation$: VisiteurDesignationModel[];
  designation: VisiteurDesignationModel[];
  vstDsTodeteID = -1;
  isValid;
  selectedDsId = -1;
  visiteursAsso$: visiteurModel[];
  visiteursAsso: visiteurModel[];
  visiteurSelected = false;
  update = -1;

  formNames = [
    "visiteurId",
    "nom",
    "organisme",
    "objet",
    "debut",
    "fin",
    "debut_sys",
    "fin_sys"
  ];
  debut;
  fin;
  finUpdate = [];
  position = 1;
  size;
  navPas = 2;
  a = 0;
  b = this.navPas;

  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService,
    private visiteurDesignationService: VisiteurDesignationService
  ) {}

  ngOnInit() {
    this.visiteurDesignationService.onGetVisiteurAssoToProjet();
    this.store
      .select(positionFicheVisiteur)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.a = state.a;
        this.b = state.b;
        this.position = state.position;
      });
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        console.log("12");

        if (state.type === "vsDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        if (state.ficheSelectionner !== null) {
          this.ficheVisiteur = state.ficheSelectionner;
          this.isValid = this.ficheVisiteur.isValidated;
          this.designation$$ = this.ficheVisiteur.designations;
          this.onFilter();
        }
      });

    this.store.select("ficheVisiteur").subscribe(state => {
      this.visiteursAsso = this.visiteursAsso$ = state.visiteursAsso;
    });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === this.ficheVisiteur.type) {
          this.ficheService.onGetFicheByType("VISITEUR", null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === this.ficheVisiteur.type) {
          this.ficheService.validerFiche(this.ficheVisiteur.id, "visiteurs");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }
  OnAddVisiteurDesignation() {}
  onFocusAddInputVisiteur(list) {
    list.hidden = false;
  }
  onBlurAddInputVisiteur(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 200);
  }
  OnVisiteurSelected(v: visiteurModel) {
    this.visiteurSelected = true;
    this.form.controls["visiteurId"].setValue(v.id);
    this.form.controls["nom"].setValue(v.nom);
    this.form.controls["organisme"].setValue(v.organisme);
  }
  onAddClick() {
    this.debut = moment().format("MM-DD-YYYY HH:mm");
    this.visiteurSelected = false;
    this.update = 0;
  }
  onAddClickOutside() {
    if (this.update === 0 && (this.form.dirty || this.visiteurSelected)) {
      let submit = true;
      this.formNames.forEach(key => {
        if (this.form.controls[key].invalid) {
          submit = false;
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "vsDs",
              showAlert: true,
              msg: "Le champs " + key + "est invalid!"
            })
          );
        }
      });
      if (submit) {
        let fin_sys = null;
        if (this.form.value["fin"].trim() !== "")
          fin_sys = moment().format("MM-DD-YYYY HH:mm");

        let ds: VisiteurDesignationModel = {
          id: null,
          nom: this.form.value["nom"],
          organisme: this.form.value["organisme"],
          objet: this.form.value["objet"],
          visiteurId: this.form.value["visiteurId"],
          debut: this.form.value["debut"],
          fin: this.form.value["fin"],
          debut_sys: moment()
            .format("MM-DD-YYYY HH:mm")
            .toString(),
          fin_sys: fin_sys,
          idFiche: this.ficheVisiteur.id
        };
        this.visiteurDesignationService.onAddVisiteurDesignation(ds);
      }
    }
    this.onReset();
    this.debut = null;
    this.fin = null;
    this.update = -1;
  }

  onFocusUpdateInputVisiteur(vistList, v) {
    this.visiteursAsso = this.visiteursAsso$.filter(vv =>
      vv.nom.includes(v.trim().toUpperCase())
    );
    this.visiteurSelected = false;
    vistList.hidden = false;
  }

  onBlurUpdateInputVisiteur(vistList) {
    setTimeout(() => {
      vistList.hidden = true;
    }, 200);
  }
  OnVisiteurSelectedUpdate(v, i) {
    this.visiteurSelected = true;
    this.form.controls["visiteurId".concat(i)].setValue(v.id);
    this.form.controls["nom".concat(i)].setValue(v.nom);
    this.form.controls["organisme".concat(i)].setValue(v.organisme);
  }

  onUpdateClick(id) {
    this.update = 1;
    this.selectedDsId = id;
    this.formNames.forEach(v => {
      this.form.controls[v.concat(id)].enable();
    });
  }

  onUpdateClickOutside(id) {
    if (this.selectedDsId === id) {
      if (this.form.dirty || this.visiteurSelected) {
        let ds$ = this.designation$.find(d => d.id === id);
        let submit = true;
        this.formNames.forEach(key => {
          if (this.form.controls[key.concat(id)].invalid) {
            submit = false;
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "vsDs",
                showAlert: true,
                msg: "Le champs " + key + "est invalid!"
              })
            );
            this.formNames.forEach(v => {
              this.form.controls[v.concat(id)].setValue(ds$[v]);
            });
          }
        });
        if (submit) {
          let fin_sys = null;
          if (ds$.fin_sys.trim() === "") {
            if (this.form.value["fin".concat(id.toString())] !== "")
              fin_sys = moment().format("MM-DD-YYYY HH:mm");
            else fin_sys = null;
          } else fin_sys = ds$.fin_sys.trim();

          let ds: VisiteurDesignationModel = {
            id: null,
            nom: this.form.value["nom".concat(id.toString())],
            organisme: this.form.value["organisme".concat(id.toString())],
            objet: this.form.value["objet".concat(id.toString())],
            visiteurId: this.form.value["visiteurId".concat(id.toString())],
            debut: this.form.value["debut".concat(id.toString())],
            debut_sys: ds$.debut_sys,
            fin:
              this.form.value["fin".concat(id.toString())] === ""
                ? ds$.fin
                : this.form.value["fin".concat(id.toString())],
            fin_sys: fin_sys,
            idFiche: this.ficheVisiteur.id
          };
          this.visiteurDesignationService.onUpdateVisiteurDesignation(ds, id);
        }
      }
      this.selectedDsId = -1;
      this.update = -1;
      this.formNames.forEach(v => {
        this.form.controls[v.concat(id)].disable();
      });
    }
  }
  onDeleteVisiteurDesignation(id) {
    this.vstDsTodeteID = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "vsDs",
        showAlert: true,
        msg: "Vous etes sure de vouloire supprimer cette designation?"
      })
    );
  }
  onSearchVisiteur(v: string) {
    if (v.trim() === "") {
      this.visiteursAsso = this.visiteursAsso$;
    } else
      this.visiteursAsso = this.visiteursAsso$.filter(vv =>
        vv.nom.includes(v.trim().toUpperCase())
      );
  }
  onInputFin() {
    this.fin = moment().format("MM-DD-YYYY HH:mm");
  }
  onInputFinUpdate(id) {
    let ds = this.designation.find(d => d.id === id);
    if (ds.fin_sys.trim() === "")
      ds.fin_sys = moment().format("MM-DD-YYYY HH:mm");
  }

  onContinue() {
    if (this.vstDsTodeteID !== -1) {
      this.visiteurDesignationService.onDeleteVisiteurDesignation(
        this.vstDsTodeteID
      );
      this.vstDsTodeteID = -1;
    }

    this.onHideAlert();
  }

  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "vsDs",
        showAlert: false,
        msg: ""
      })
    );
  }

  onFilter() {
    let inputSearchName = ["organisme", "nom"];
    this.designation$ = this.slice(this.designation$$);
    if (typeof this.form !== "undefined")
      inputSearchName.forEach((key: string) => {
        if (typeof this.form.value[key.concat("$")] !== "undefined") {
          let vv = this.form.value[key.concat("$")].trim().toUpperCase();
          if (vv !== "")
            this.designation$ = this.designation$.filter(d => {
              return d[key].includes(vv);
            });
        }
      });
    this.designation = this.designation$.slice(this.a, this.b);
    this.size = Math.trunc(this.designation$.length / this.navPas);
    if (this.size < this.designation$.length / this.navPas)
      this.size = this.size + 1;
  }

  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      this.b = this.navPas * this.position;
      this.a = this.b - this.navPas;
      this.designation = this.designation$.slice(this.a, this.b);
      this.store.dispatch(
        new fromFicheVisiteurAction.getNavigationState({
          a: this.a,
          b: this.b,
          position: this.position
        })
      );
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      this.a = this.navPas * this.position;
      this.position = this.position + 1;
      this.b = this.a + this.navPas;
      this.designation = this.designation$.slice(this.a, this.b);
      this.store.dispatch(
        new fromFicheVisiteurAction.getNavigationState({
          a: this.a,
          b: this.b,
          position: this.position
        })
      );
    }
  }

  slice(Dss) {
    return [...Dss].map(m => JSON.parse(JSON.stringify(m)));
  }
  onReset() {
    this.formNames.forEach(v => {
      this.form.controls[v].setValue("");
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
