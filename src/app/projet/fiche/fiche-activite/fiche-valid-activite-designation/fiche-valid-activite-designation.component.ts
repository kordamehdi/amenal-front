import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { FicheActiviteService } from "../fiche-activite.service";
import { FicheService } from "../../fiche.service";
import * as App from "../../../../store/app.reducers";
import { untilDestroyed } from "ngx-take-until-destroy";
import { refresh } from "../../header/head.selector";

@Component({
  selector: "app-fiche-valid-activite-designation",
  templateUrl: "./fiche-valid-activite-designation.component.html",
  styleUrls: ["./fiche-valid-activite-designation.component.scss"]
})
export class FicheValidActiviteDesignationComponent
  implements OnInit, OnDestroy {
  errorMsg;
  showAlert;
  ficheActivite;
  designation;
  showSousLot = [];
  showDetailsSousLot = [[]];
  selectedLot;
  selectedSousLot;
  constructor(
    private store: Store<App.AppState>,
    private ficheActiviteService: FicheActiviteService,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "ficheActivite" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.ficheActivite = state.ficheSelectionner;
        this.designation = this.ficheActivite.designations;
        let dd = new Array(this.designation.length);
        this.designation.forEach((v, i) => {
          if (this.showDetailsSousLot[i] == null) dd[i] = [false];
          else dd[i] = this.showDetailsSousLot[i];
        });
        this.showDetailsSousLot = dd;
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "ACTIVITE") {
          this.ficheActiviteService.OnlistSousLotParProjet();
          this.ficheActiviteService.OnlistLotParProjet();
          this.ficheActiviteService.OnListEntreeDesignationNoAsso();
          this.ficheService.onGetFicheByType("ACTIVITE", null);
        }
      });
  }

  onClickDesignation(i) {
    this.selectedLot = i;
  }
  onClickOutsideDesignation(i) {
    if (this.selectedLot == i) {
      this.selectedLot = -1;
    }
  }
  onClickSousLot(lot, i, j) {
    this.selectedLot = -1;
    this.selectedSousLot = "".concat(i, "_", j);
  }
  onClickOutsideSousLot(sLotDs, i, j) {
    let ii = "".concat(i, "_", j);
    if (this.selectedSousLot === ii) {
      this.selectedSousLot = "";
    }
  }

  onShowshowDetail(i) {
    this.showSousLot[i] = !this.showSousLot[i];
  }
  onShowshowDetailOfdetail(i, j) {
    this.showDetailsSousLot[i][j] = !this.showDetailsSousLot[i][j];
  }

  transI_J(i, j) {
    return "".concat(i, "_", j);
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
