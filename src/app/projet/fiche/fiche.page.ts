import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../store/app.reducers";
import * as fromProjetAction from "../redux/projet.actions";
import * as fromFicheOuvrierAction from "./fiche-ouvrier/redux/fiche-ouvrier.action";

@Component({
  selector: "app-fiche",
  templateUrl: "./fiche.page.html",
  styleUrls: ["./fiche.page.scss"]
})
export class FichePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
