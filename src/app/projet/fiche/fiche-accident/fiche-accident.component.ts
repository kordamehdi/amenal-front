import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";

@Component({
  selector: "app-fiche-accident",
  templateUrl: "./fiche-accident.component.html",
  styleUrls: ["./fiche-accident.component.scss"]
})
export class FicheAccidentComponent implements OnInit {
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
}
