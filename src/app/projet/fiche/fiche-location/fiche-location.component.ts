import { Component, OnInit } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-location",
  templateUrl: "./fiche-location.component.html",
  styleUrls: ["./fiche-location.component.scss"]
})
export class FicheLocationComponent implements OnInit {
  culumn = ["fournisseur"];
  isValid;
  role;
  lister: Boolean = false;
  isRoot;
  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("projet").subscribe(state => {
      this.role = state.currentUser.currentRole;
      this.isRoot = state.currentUser.isRoot;
    });
    this.store.select("fiche").subscribe(state => {
      this.lister = state.listerOuvrier;
      this.isValid = state.Fiches[state.FicheSelectionnerPosition].isValidated;
    });
  }
}
