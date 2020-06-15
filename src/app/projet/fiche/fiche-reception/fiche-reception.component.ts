import { Component, OnInit } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";
@Component({
  selector: "app-fiche-reception",
  templateUrl: "./fiche-reception.component.html",
  styleUrls: ["./fiche-reception.component.scss"]
})
export class FicheReceptionComponent implements OnInit {
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
