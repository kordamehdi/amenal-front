import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";

@Component({
  selector: "app-fiche-visiteur",
  templateUrl: "./fiche-visiteur.component.html",
  styleUrls: ["./fiche-visiteur.component.scss"]
})
export class FicheVisiteurComponent implements OnInit {
  lister: Boolean = false;
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
      this.lister = state.listerOuvrier;
      this.isValid = state.Fiches[state.FicheSelectionnerPosition].isValidated;
    });
  }
}
