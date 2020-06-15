import { Component, OnInit, OnDestroy } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-besion",
  templateUrl: "./fiche-besion.component.html",
  styleUrls: ["./fiche-besion.component.scss"]
})
export class FicheBesionComponent implements OnInit, OnDestroy {
  isValid;
  role;
  isRoot;
  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("projet").subscribe(state => {
      this.role = state.currentUser.currentRole;
      this.isRoot = state.currentUser.isRoot;
    });
    this.store.select("fiche").subscribe(state => {
      this.isValid = state.Fiches[state.FicheSelectionnerPosition].isValidated;
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
