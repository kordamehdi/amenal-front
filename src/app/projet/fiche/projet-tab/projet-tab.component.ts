import { LoginService } from "./../../../login/login.service";
import { ProjetService } from "./projet-tab.service";
import { ProjetModel } from "src/app/projet/models/projet.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import * as fromFicheAction from "../redux/fiche.action";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";

@Component({
  selector: "app-projet-tab",
  templateUrl: "./projet-tab.component.html",
  styleUrls: ["./projet-tab.component.scss"]
})
export class ProjetTabComponent implements OnInit {
  isUpdate = -1;
  projets: ProjetModel[];
  errorMsg = "";
  showAlert = false;
  projetIdToDelete = -1;
  showSideBar;

  @ViewChild("f", { static: false })
  form: NgForm;

  formNames = ["intitule", "abreveation", "debut", "description"];

  constructor(
    private store: Store<App.AppState>,
    private projetService: ProjetService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.store.select("projet").subscribe(p => {
      this.projets = p.projets;
      console.log(this.projets);
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "projet") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onAddProjet() {
    let projet: ProjetModel = {
      id: null,
      intitule: this.form.value["intitule"],
      abreveation: this.form.value["abreveation"],
      debut: null,
      fin: null,
      description: this.form.value["description"],
      fichierTypes: null,
      ouvriers: null
    };
    this.projetService.ajouterProjet(projet);
  }
  onDelete(id) {
    this.projetIdToDelete = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "projet",
        showAlert: true,
        msg: "Vous etes sure de vouloire supprimer ce projet?"
      })
    );
  }
  onUpdateProjet() {}

  onAddClick() {
    this.isUpdate = 0;
  }
  onHideSideBar() {
    this.showSideBar = false;
  }

  onShowSideBar(ev) {
    this.showSideBar = true;
  }

  onAddClickOutside() {
    if (this.isUpdate !== -1) {
      this.isUpdate = -1;
      let submit = true;
      this.formNames.forEach(key => {
        if (this.form.controls[key].invalid) submit = false;
      });

      if (submit) this.form.ngSubmit.emit();
    }
  }

  onLogOut() {
    this.loginService.logout();
  }

  onContinue() {
    if (this.projetIdToDelete !== -1) {
      this.projetService.deleteProjet(this.projetIdToDelete);
      this.projetIdToDelete = -1;
    }
    this.onHideAlert();
  }

  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "projet",
        showAlert: false,
        msg: ""
      })
    );
  }
}
