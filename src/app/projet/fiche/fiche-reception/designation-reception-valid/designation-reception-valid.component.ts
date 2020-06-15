import { Component, OnInit, OnDestroy } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import * as FromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-designation-reception-valid",
  templateUrl: "./designation-reception-valid.component.html",
  styleUrls: ["./designation-reception-valid.component.scss"]
})
export class DesignationReceptionValidComponent implements OnInit, OnDestroy {
  errorMsg: string;
  showAlert = false;
  FicheReception;
  categories;
  showDetails = [];

  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "recDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.FicheReception = {
          ...state.Fiches[state.FicheSelectionnerPosition]
        };
        if (this.FicheReception.categories !== undefined) {
          this.categories = this.FicheReception.categories;
        } else this.categories = [];
      });
  }
  onShowshowDetail(i) {
    this.showDetails[i] = !this.showDetails[i];
  }
  onHideAlert() {
    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "recDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
