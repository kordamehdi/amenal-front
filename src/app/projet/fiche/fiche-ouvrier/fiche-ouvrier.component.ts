import { Store } from "@ngrx/store";
import { FicheOuvrierService } from "./fiche-ouvrier.service";
import { OuvrierModel } from "./../../models/ouvrier.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as App from "../../../store/app.reducers";
import * as fromFicheOuvrierAction from "./redux/fiche-ouvrier.action";
import * as moment from "moment";

@Component({
  selector: "app-fiche-ouvrier",
  templateUrl: "./fiche-ouvrier.component.html",
  styleUrls: ["./fiche-ouvrier.component.scss"]
})
export class FicheOuvrierComponent implements OnInit {
  isValid;
  lister: Boolean = false;
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
