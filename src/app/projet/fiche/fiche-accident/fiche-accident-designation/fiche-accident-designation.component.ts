import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import { FicheAccidentService } from "./../fiche-accident.service";
import { untilDestroyed } from "ngx-take-until-destroy";
@Component({
  selector: "app-fiche-accident-designation",
  templateUrl: "./fiche-accident-designation.component.html",
  styleUrls: ["./fiche-accident-designation.component.scss"]
})
export class FicheAccidentDesignationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  errorMsg;
  showAlert;
  ficheAccident;
  designation$;
  isValid;
  selectedDs = -1;
  update = -1;
  selectedDsID = -1;
  subscription;

  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService,
    private ficheAccidentService: FicheAccidentService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "accidentDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        this.ficheAccident = state.ficheSelectionner;
        this.isValid = this.ficheAccident.isValidated;

        this.designation$ = this.ficheAccident.designations;
      });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === this.ficheAccident.type) {
          this.ficheService.onGetFicheByType(this.ficheAccident.type, null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === this.ficheAccident.type) {
          console.log("ACCIDENT ", state, " type ", this.ficheAccident.type);
          this.ficheService.validerFiche(this.ficheAccident.id, "accidents");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }
  OnAddClick() {
    this.update = 0;
  }
  OnAddClickOutside(objetInput, heureInput) {
    if (this.update === 0) {
      let objet = objetInput.value;
      let heure = heureInput.value;
      this.update = -1;
      if (objet.trim() == "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "accidentDs",
            showAlert: false,
            msg: "Le champs objet est obligatroire!"
          })
        );
      } else {
        this.ficheAccidentService.onAddAccident({
          id: null,
          objet: objet,
          heure: heure
        });
        this.update = -1;
        objetInput.value = "";
        heureInput.value = "";
      }
    }
  }
  OnUpdateClick(objetInpt, heureInpt, i) {
    objetInpt.disabled = false;
    heureInpt.disabled = false;
    this.update = 1;
    this.selectedDs = i;
  }
  OnUpdateClickOutside(objetInpt, heureInpt, id, i) {
    if (this.update === 1 && this.selectedDs === i) {
      let objet = objetInpt.value;
      let heure = heureInpt.value;
      objetInpt.disabled = true;
      heureInpt.disabled = true;
      this.selectedDs = -1;
      this.update = -1;
      if (
        this.designation$[i].objet !== objet.toUpperCase() ||
        this.designation$[i].heure !== heure
      ) {
        if (objet.trim() == "") {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "accidentDs",
              showAlert: false,
              msg: "Le champs objet est obligatroire!"
            })
          );
        } else {
          this.ficheAccidentService.onUpdateAccident(
            {
              objet: objet,
              heure: heure
            },
            id
          );
          this.update = -1;
        }
      }
    }
  }
  onDelete(objt, id) {
    this.selectedDsID = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "accidentDs",
        showAlert: true,
        msg: "Vous etes sure de vouloire supprimer l' accident: " + objt
      })
    );
  }

  onContinue() {
    if (this.selectedDsID !== -1) {
      this.ficheAccidentService.onDeleteAccident(this.selectedDsID);
      this.selectedDsID = -1;
    }
    this.onHideAlert();
  }

  onHideAlert() {
    this.selectedDs = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "accidentDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
