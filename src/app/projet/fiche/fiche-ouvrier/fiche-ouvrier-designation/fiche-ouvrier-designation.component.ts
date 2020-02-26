import { FicheService } from "./../../fiche.service";
import { nextFiche, validerFiche } from "./../../nav/nav.selector";
import { ProjetModel } from "./../../../models/projet.model";
import { Component, OnInit, ViewChild, OnChanges } from "@angular/core";
import { Store } from "@ngrx/store";
import { FicheOuvrierDesignationService } from "./fiche-ouvrier-designation.service";
import * as App from "../../../../store/app.reducers";
import * as fromProjetAction from "../../../../projet/redux/projet.actions";
import * as fromFicheAction from "../../redux/fiche.action";
import { ouvrierDesignationModel } from "src/app/projet/models/ouvrierDesignation.model";
import { NgForm } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-fiche-ouvrier-designation",
  templateUrl: "./fiche-ouvrier-designation.component.html",
  styleUrls: ["./fiche-ouvrier-designation.component.scss"]
})
export class FicheOuvrierDesignationComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;

  columnDesignation: String[];
  FicheOuvrier: any;
  projetSelectionner: ProjetModel;
  ouvrierCin: String;
  ouvrierQualification: String;
  ouvDsSlIndex: number;
  formNames = ["ouvID", "debut", "fin", "travail", "epi", "hSup", "jour"];
  formNamesOnUpdate = ["debut", "fin", "travail", "epi", "hSup", "jour"];
  isUpdate;
  showAlert: Boolean = false;
  errorMsg = "Erreur!";
  Trv: string;

  constructor(
    private ficheService: FicheService,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.ficheOuvrierDesignationService.onGetOuvrierByProjet();
    this.store.select("ficheOuvrier").subscribe(state => {
      this.columnDesignation = state.columnDesignation;
    });

    this.store.select("fiche").subscribe(state => {
      this.errorMsg = state.errorMsg;
      this.showAlert = state.showAlert;
      this.projetSelectionner = { ...state.projetSelectionner };
      this.FicheOuvrier = { ...state.Fiches[state.FicheSelectionnerPosition] };
    });
    this.store.select(nextFiche).subscribe(state => {
      this.ouvrierQualification = this.ouvrierCin = "";
      if (this.form != null) this.form.reset();
    });
    this.store.select(validerFiche).subscribe(state => {
      if (state) this.ficheService.validerFiche(this.FicheOuvrier.id);
    });
  }

  onSelect(id) {
    this.ouvrierCin = {
      ...this.projetSelectionner.ouvriers.find(ouv => {
        return ouv.id == id;
      })
    }.cin;
    this.ouvrierQualification = {
      ...this.projetSelectionner.ouvriers.find(ouv => ouv.id == id)
    }.qualification;
    console.log("ssss", id, "dddd", this.ouvrierCin);
  }

  OnAddOuvrierDesignation() {
    const ouvDs: ouvrierDesignationModel = {
      id: null,
      idOuvrier: this.form.value["ouvID"],
      nom: "",
      prenom: "",
      qualification: "",
      cin: "",
      tempsDebut: this.form.value["debut"],
      tempsFin: this.form.value["fin"],
      travail: this.form.value["travail"],
      epi: this.form.value["epi"],
      hsup: this.form.value["hSup"],
      jour: this.form.value["jour"],
      idFiche: this.FicheOuvrier.id,
      valid: this.timeException(
        this.form.value["debut"],
        this.form.value["fin"],
        this.form.value["hSup"],
        this.form.value["jour"]
      )
    };

    this.ficheOuvrierDesignationService.OnSaveOuvrierDesignation(ouvDs);
    this.form.reset();
    this.ouvrierQualification = this.ouvrierCin = "";
  }

  OnUpdateOuvrierDesignation() {
    const ouvDs: ouvrierDesignationModel = {
      id: null,
      idOuvrier: this.FicheOuvrier.ouvrierDesignations[this.ouvDsSlIndex]
        .idOuvrier,
      nom: this.FicheOuvrier.ouvrierDesignations[this.ouvDsSlIndex].nom,
      prenom: "",
      qualification: this.FicheOuvrier.ouvrierDesignations[this.ouvDsSlIndex]
        .qualification,
      cin: this.FicheOuvrier.ouvrierDesignations[this.ouvDsSlIndex].cin,
      tempsDebut: this.form.value["debut".concat(this.ouvDsSlIndex.toString())],
      tempsFin: this.form.value["fin".concat(this.ouvDsSlIndex.toString())],
      travail: this.form.value["travail".concat(this.ouvDsSlIndex.toString())],
      epi: this.form.value["epi".concat(this.ouvDsSlIndex.toString())],
      hsup: this.form.value["hSup".concat(this.ouvDsSlIndex.toString())],
      jour: this.form.value["jour".concat(this.ouvDsSlIndex.toString())],
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
      this.FicheOuvrier.ouvrierDesignations[this.ouvDsSlIndex].id
    );
    this.form.reset();
    this.ouvrierQualification = this.ouvrierCin = "";
  }

  onBlur(event) {
    const myInput = this.form.controls[event.target.name];

    if (myInput.invalid) {
      this.store.dispatch(new fromProjetAction.IsBlack(true));
      this.store.dispatch(new fromFicheAction.ShowAlert(true));
    } else {
      let submit = true;
      this.formNames.forEach((key: any) => {
        if (this.form.controls[key].invalid) {
          submit = false;
        }
      });

      if (submit) this.form.ngSubmit.emit();
    }
  }
  onUpdateBlur(event) {
    const myInput = this.form.controls[
      event.target.attributes.getNamedItem("ng-reflect-name").value
    ];

    if (this.form.dirty) {
      if (myInput.invalid) {
        this.store.dispatch(new fromProjetAction.IsBlack(true));
        this.store.dispatch(new fromFicheAction.ShowAlert(true));
      } else {
        let submit = true;
        this.formNamesOnUpdate.forEach((key: any) => {
          if (this.form.controls[key].invalid) {
            submit = true;
          }
        });

        if (submit) this.form.ngSubmit.emit();
      }
    }
  }
  onFocus(fID) {
    this.isUpdate = true;
    this.ouvDsSlIndex = fID;
  }

  onLongPress(ouvDsId) {
    this.store.dispatch(new fromFicheAction.StartRemovingDs(ouvDsId));
  }
  onDelete() {
    this.store.dispatch(
      new fromFicheAction.ShowAlert({
        showAlert: false,
        msg: ""
      })
    );
    this.ficheOuvrierDesignationService.OnDeleteOuvrierDesignation();
  }
  onHideAlert() {
    this.store.dispatch(new fromFicheAction.FinishRemovingDs());
  }

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

  timeException(dateDebut, dateFin, hsup, jour) {
    var startTime = moment(dateDebut, "HH:mm:ss");
    var endTime = moment(dateFin, "HH:mm:ss");

    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime)).asHours();
    if (duration < 0 || +duration + 2 > +jour * 9 + +hsup) return false;
    else return true;
  }
}
