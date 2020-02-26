import { ListerOuvrier } from "./../redux/fiche.action";
import { Store } from "@ngrx/store";
import { FicheOuvrierService } from "./fiche-ouvrier.service";
import { OuvrierModel } from "./../../models/ouvrier.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as App from "../../../store/app.reducers";
import * as fromProjetAction from "../../../projet/redux/projet.actions";
import * as fromFicheOuvrierAction from "./redux/fiche-ouvrier.action";

@Component({
  selector: "app-fiche-ouvrier",
  templateUrl: "./fiche-ouvrier.component.html",
  styleUrls: ["./fiche-ouvrier.component.scss"]
})
export class FicheOuvrierComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;
  isCompleted: boolean = false;
  ouvriers: OuvrierModel[];
  columnOuvrier: String[];
  qualification: String[];
  hasError: Boolean = false;
  errorMsg = "Erreur!";
  listerOuvrier: Boolean;
  isUpdate: Boolean = false;
  focusID = -1;
  ouvSl = -1;

  constructor(
    private ficheOuvrierService: FicheOuvrierService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.store.select("ficheOuvrier").subscribe(state => {
      this.columnOuvrier = state.columnOuvrier;
      this.qualification = state.qualifications;
      this.hasError = state.showAlert;
      this.ouvriers = state.ouvriers;
      this.errorMsg = state.errorMsg;
    });
    this.store.select("fiche").subscribe(state => {
      this.listerOuvrier = state.listerOuvrier;
    });
  }

  OnAddOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin"],
      nom: this.form.value["nom"],
      prenom: this.form.value["prenom"],
      qualification: this.form.value["qualification"],
      dateNaissance: this.form.value["age"],
      dateRecrutement: this.form.value["ancienter"],
      J_TRV: this.form.value["J_TRV"],
      tele: this.form.value["tele"],
      appreciation: this.form.value["appreciation"],
      idProjets: []
    };
    this.ficheOuvrierService.OnSaveOuvrier(ouvrier);
    this.form.reset();
  }
  OnUpdateOuvrier() {
    const ouvrier: OuvrierModel = {
      id: null,
      cin: this.form.value["cin".concat(this.ouvSl.toString())],
      nom: this.form.value["nom".concat(this.ouvSl.toString())],
      prenom: this.form.value["prenom".concat(this.ouvSl.toString())],
      qualification: this.form.value[
        "qualification".concat(this.ouvSl.toString())
      ],
      dateNaissance: this.form.value["age".concat(this.ouvSl.toString())],
      dateRecrutement: this.form.value[
        "ancienter".concat(this.ouvSl.toString())
      ],
      J_TRV: this.form.value["J_TRV".concat(this.ouvSl.toString())],
      tele: this.form.value["tele".concat(this.ouvSl.toString())],
      appreciation: this.form.value[
        "appreciation".concat(this.ouvSl.toString())
      ],
      idProjets: []
    };
    this.ficheOuvrierService.OnUpdateOuvrier(ouvrier, this.ouvSl);
  }
  onBlur(event) {
    this.focusID = -1;
    console.log("87878778787887877878787878", this.form.dirty);

    if (this.form.dirty) {
      const myInput = this.form.controls[
        event.target.attributes.getNamedItem("ng-reflect-name").value
      ];
      let submit = false;
      if (myInput.invalid) {
        console.log("87878778787887877878787878", this.form.dirty);
        this.store.dispatch(
          new fromFicheOuvrierAction.ShowAlert({
            showAlert: true,
            msg: "verifier les champs!"
          })
        );
      } else {
        submit = true;
        this.columnOuvrier.forEach((key: string) => {
          if (key !== "qualification") {
            if (this.form.controls[key].invalid) {
              submit = false;
            }
          }
        });

        if (submit) this.form.ngSubmit.emit();
      }
    }
  }
  onUpdateBlur(event) {
    this.focusID = -1;
    if (this.form.dirty) {
      const myInput = this.form.controls[
        event.target.attributes.getNamedItem("ng-reflect-name").value
      ];
      let submit = false;
      if (myInput.invalid) {
        //this.store.dispatch(new fromProjetAction.IsBlack(true));
        this.store.dispatch(new fromFicheOuvrierAction.ShowAlert(true));
      } else this.form.ngSubmit.emit();
    }
  }
  addOuvToProjet(idOuvrier) {
    this.ficheOuvrierService.onAddOuvrierToProjet(idOuvrier);
  }

  onLongPress(ouvId) {
    this.store.dispatch(new fromFicheOuvrierAction.StartRemovingOuvrier(ouvId));
  }
  onDelete() {
    this.store.dispatch(
      new fromFicheOuvrierAction.ShowAlert({
        showAlert: false,
        msg: ""
      })
    );
    this.ficheOuvrierService.OnDeleteOuvrier();
  }
  onHideAlert() {
    this.store.dispatch(new fromFicheOuvrierAction.FinishRemovingOuvrier());
  }
  onFocus(fID) {
    this.ouvSl = fID;
    this.isUpdate = true;
    this.focusID = fID;
  }
}
