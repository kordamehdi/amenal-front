import { Component, OnInit } from "@angular/core";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-livraison",
  templateUrl: "./fiche-livraison.component.html",
  styleUrls: ["./fiche-livraison.component.scss"]
})
export class FicheLivraisonComponent implements OnInit {
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
      if (state.ficheSelectionner !== null)
        this.isValid = state.ficheSelectionner.isValidated;
    });
  }
}
