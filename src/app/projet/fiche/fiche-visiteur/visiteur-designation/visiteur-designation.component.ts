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
import { NgForm } from "@angular/forms";

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
  designation$;
  isValid;
  selectedDsIndex = -1;
  selectedDsId = -1;
  visiteursAsso$: visiteurModel[];
  visiteursAsso: visiteurModel[];
  visiteurSelected = false;
  update = -1;
  formNames = ["visiteurId", "nom", "organisme", "objet", "depart", "arivee"];
  now;
  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService,
    private visiteurDesignationService: VisiteurDesignationService
  ) {}

  ngOnInit() {
    this.now = moment().format("YYYY-MM-DD");
    this.visiteurDesignationService.onGetVisiteurAssoToProjet();
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "vsDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        if (state.ficheSelectionner !== null)
          this.ficheVisiteur = state.ficheSelectionner;
        this.isValid = this.ficheVisiteur.isValidated;

        this.designation$ = this.ficheVisiteur.designations;
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
  OnAddVisiteurDesignation() {
    let ds: VisiteurDesignationModel = {
      id: null,
      nom: this.form.value["nom"],
      organisme: this.form.value["organisme"],
      objet: this.form.value["objet"],
      visiteurId: this.form.value["visiteurId"],
      arivee: this.form.value["arivee"],
      depart: this.form.value["depart"],
      idFiche: this.ficheVisiteur.id
    };
    this.visiteurDesignationService.onAddVisiteurDesignation(ds);
    this.update = -1;
    this.onReset();
  }
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
      if (submit) this.form.ngSubmit.emit();
      else this.update = -1;
    }
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

  onUpdateClick(i, id, v: string) {
    this.update = 1;
    this.selectedDsId = id;

    this.selectedDsIndex = i;
    this.formNames.forEach(v => {
      this.form.controls[v.concat(i)].enable();
    });
  }

  onUpdateClickOutside(i) {
    if (this.selectedDsIndex === i) {
      if (this.update === 1 && (this.form.dirty || this.visiteurSelected)) {
        let submit = true;
        this.formNames.forEach(key => {
          if (this.form.controls[key.concat(i)].invalid) {
            submit = false;
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "vsDs",
                showAlert: true,
                msg: "Le champs " + key + "est invalid!"
              })
            );
            this.formNames.forEach(v => {
              this.form.controls[v.concat(i)].setValue(this.designation$[i][v]);
            });
          }
        });
        if (submit) this.form.ngSubmit.emit();
        else {
          this.selectedDsId = -1;
          this.update = -1;
        }
      } else this.selectedDsIndex = -1;
      this.formNames.forEach(v => {
        this.form.controls[v.concat(i)].disable();
      });
    }
  }
  OnUpdateVisiteurDesignation() {
    let ds: VisiteurDesignationModel = {
      id: null,
      nom: this.form.value["nom".concat(this.selectedDsIndex.toString())],
      organisme: this.form.value[
        "organisme".concat(this.selectedDsIndex.toString())
      ],
      objet: this.form.value["objet".concat(this.selectedDsIndex.toString())],
      visiteurId: this.form.value[
        "visiteurId".concat(this.selectedDsIndex.toString())
      ],
      arivee: this.form.value["arivee".concat(this.selectedDsIndex.toString())],
      depart: this.form.value["depart".concat(this.selectedDsIndex.toString())],
      idFiche: this.ficheVisiteur.id
    };
    this.visiteurDesignationService.onUpdateVisiteurDesignation(
      ds,
      this.selectedDsId
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

  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "vsDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  onReset() {
    ["visiteurId", "nom", "organisme", "objet", "depart"].forEach(v => {
      this.form.controls[v].reset();
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
