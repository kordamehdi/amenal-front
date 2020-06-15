import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";
@Component({
  selector: "app-fiche-accident-designation-valid",
  templateUrl: "./fiche-accident-designation-valid.component.html",
  styleUrls: ["./fiche-accident-designation-valid.component.scss"]
})
export class FicheAccidentDesignationValidComponent
  implements OnInit, OnDestroy {
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
    private ficheService: FicheService
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

        this.ficheAccident = state.Fiches[state.FicheSelectionnerPosition];
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
  }

  onContinue() {
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
