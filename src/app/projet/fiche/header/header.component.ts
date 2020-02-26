import { FicheService } from "./../fiche.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FicheOuvrierDesignationService } from "./../fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { FicheOuvrierService } from "./../fiche-ouvrier/fiche-ouvrier.service";
import { ProjetModel } from "./../../models/projet.model";
import { GetProjets } from "./../../redux/projet.actions";
import * as App from "./../../../store/app.reducers";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromProjetAction from "../../redux/projet.actions";
import * as fromFicheAction from "../redux/fiche.action";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  projets: ProjetModel[];
  fichierTypes: String[];
  dateFiche: Date;
  selectDisable: boolean = true;
  ficheSelectionner;
  constructor(
    private store: Store<App.AppState>,
    private ficheOuvrierService: FicheOuvrierService,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService,
    private ficheService: FicheService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.store.dispatch(new GetProjets());
    this.store.select("projet").subscribe(p => {
      this.projets = p.projets;
    });
    this.store.select("fiche").subscribe(ficheState => {
      this.ficheSelectionner =
        ficheState.Fiches[ficheState.FicheSelectionnerPosition];
    });
  }
  OnSelectProjet(id) {
    this.selectDisable = false;
    const projetSelectionner = this.projets.find(p => {
      return p.id == id;
    });
    this.store.dispatch(new fromFicheAction.SelectProjet(projetSelectionner));
    this.fichierTypes = projetSelectionner.fichierTypes;
    this.ficheOuvrierService.onGetOuvriers();
  }
  OnSelectProjetType(type: String) {
    this.store.dispatch(new fromFicheAction.SelectFicheType(type));

    this.ficheService.onGetFicheByType(type, this.route);
  }
}
