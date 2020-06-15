import { Component, OnInit } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-activite",
  templateUrl: "./fiche-activite.component.html",
  styleUrls: ["./fiche-activite.component.scss"]
})
export class FicheActiviteComponent implements OnInit {
  isValid;
  role;
  lister: Boolean = true;
  isRoot = true;
  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("projet").subscribe(state => {
      //this.role = state.currentUser.currentRole;
      //  this.isRoot = state.currentUser.isRoot;
    });
    this.store.select("fiche").subscribe(state => {
      //    this.lister = state.listerOuvrier;
      //     this.isValid = state.Fiches[state.FicheSelectionnerPosition].isValidated;
    });
  }
}
