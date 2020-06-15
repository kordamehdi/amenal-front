import { ProjetService } from "./../projet-tab/projet-tab.service";
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
import { refresh, typeChange } from "./head.selector";
import { LoginService } from "src/app/login/login.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  projets: ProjetModel[];
  fichierTypes: String[];
  dateFiche: Date;
  typeShow = "selectonner le type de fiche...";
  makeItGray = false;
  onClickedListTypes = false;
  selectDisable: boolean = true;
  ficheSelectionner;
  projetSelectionner;
  maxDate;
  minDate;
  constructor(
    private store: Store<App.AppState>,
    private ficheOuvrierService: FicheOuvrierService,
    private projetService: ProjetService,
    private ficheService: FicheService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.projetService.listerProjet();
    this.store.select("projet").subscribe(p => {
      this.projets = p.projets;
    });
    this.store.select("fiche").subscribe(ficheState => {
      this.ficheSelectionner =
        ficheState.Fiches[ficheState.FicheSelectionnerPosition];
      this.minDate = ficheState.minDate;
      this.maxDate = ficheState.maxDate;
      this.projetSelectionner = ficheState.projetSelectionner;

      if (this.projetSelectionner != null)
        this.fichierTypes = this.projetSelectionner.fichierTypes;
    });

    this.store.select(refresh).subscribe(type => {
      if (type.refresh === "") this.store.dispatch(new GetProjets());
    });
    this.store.select(typeChange).subscribe(type => {
      this.typeShow = type;
      this.router.navigate([type.toLocaleLowerCase()], {
        relativeTo: this.route
      });
    });
  }
  onRefresh() {
    this.store.dispatch(new fromProjetAction.Refresh(this.typeShow));
  }
  OnSelectProjet(id) {
    //this.store.dispatch(new fromFicheAction.Lister(false));
    this.selectDisable = false;
    const projetSelectionner = this.projets.find(p => {
      return p.id == id;
    });
    this.store.dispatch(new fromFicheAction.SelectProjet(projetSelectionner));
    this.fichierTypes = projetSelectionner.fichierTypes;
    this.router.navigate(["/"]);
  }
  OnSelectProjetType(type: string, types) {
    if (type !== "TOUS") this.makeItGray = true;
    else this.makeItGray = false;
    types.hidden = false;
    this.store.dispatch(new fromFicheAction.ValiderFiche(""));
    this.ficheService.onGetFicheByType(type, this.route);
  }
  onListeProjet() {
    this.router.navigate(["/projet"]);
  }
  onShowList(types) {
    types.hidden = false;
    this.onClickedListTypes = true;
  }
  onShowTypesClickOutside(types) {
    if (this.onClickedListTypes)
      setTimeout(() => {
        types.hidden = true;
      }, 200);
  }
  onFilterByDate(date) {
    this.store.dispatch(new fromFicheAction.filterByDate(date));
  }
  onLogOut() {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }
}
