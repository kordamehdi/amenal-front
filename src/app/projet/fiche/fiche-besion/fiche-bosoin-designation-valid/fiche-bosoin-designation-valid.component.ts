import {
  besionModel,
  besoinDesignationModel
} from "./../../../models/besion.model";
import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { FicheBesionService } from "./../fiche-besion.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import { untilDestroyed } from "ngx-take-until-destroy";
import { NgForm } from "@angular/forms";
@Component({
  selector: "app-fiche-bosoin-designation-valid",
  templateUrl: "./fiche-bosoin-designation-valid.component.html",
  styleUrls: ["./fiche-bosoin-designation-valid.component.scss"]
})
export class FicheBosoinDesignationValidComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;
  selectedDsIndex;
  selectedDsID;
  focusedDsID = -1;

  errorMsg;
  ficheBsn;
  showAlert;
  designation$;
  constructor(
    private ficheBesionService: FicheBesionService,
    private store: Store<App.AppState>,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "BsDs") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        this.ficheBsn = state.ficheSelectionner;

        this.designation$ = this.ficheBsn.designations;
      });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === this.ficheBsn.type) {
          this.ficheService.onGetFicheByType(this.ficheBsn.type, null);
        }
      });
  }
  onUpdateClick(i, id) {
    this.selectedDsIndex = i;
  }
  onUpdateClickOutside(i) {
    if (this.selectedDsIndex === i) {
      this.selectedDsIndex = -1;
    }
  }
  onContinue() {
    this.onHideAlert();
  }

  onHideAlert() {
    this.selectedDsIndex = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "BsDs",
        showAlert: false,
        msg: ""
      })
    );
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
