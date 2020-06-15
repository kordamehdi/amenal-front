import { Component, OnInit } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-document",
  templateUrl: "./fiche-document.component.html",
  styleUrls: ["./fiche-document.component.scss"]
})
export class FicheDocumentComponent implements OnInit {
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
