import { VisiteurService } from "./visiteur.service";
import { Component, OnInit } from "@angular/core";
import { visiteurModel } from "src/app/projet/models/fiche-visiteur.model";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import * as fromProjetAction from "../../../redux/projet.actions";
import * as fromFicheVisiteurAction from "../redux/fiche-visiteur.action";
import { HttpClient } from "selenium-webdriver/http";

@Component({
  selector: "app-visiteur",
  templateUrl: "./visiteur.component.html",
  styleUrls: ["./visiteur.component.scss"]
})
export class VisiteurComponent implements OnInit {
  visiteurs: visiteurModel[];
  isUpdate = -1;
  vstSelectedIndex = -1;
  vstToDeleteId = -1;
  vstToAssId = -1;
  errorMsg;
  showAlert;
  assVstToPrjt = true;
  constructor(
    private visiteurService: VisiteurService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.visiteurService.onGetVisiteur();
    this.store.select("fiche").subscribe(state => {
      if (state.type === "visiteur" || state.type === "unite") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
    this.store.select("ficheVisiteur").subscribe(state => {
      this.visiteurs = state.visiteurs;
    });
  }

  onAddClick() {
    this.isUpdate = 0;
  }

  onAddClickOutside(inputNom, inputOrg) {
    if (this.isUpdate === 0) {
      let nom = inputNom.value.trim();
      let org = inputOrg.value.trim();
      if (nom !== "" && org !== "")
        if (nom === "" && org !== "")
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: "Le champs NOM & PRENOM est obligatoire!"
            })
          );
        else if (nom !== "" && org === "")
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "visiteur",
              showAlert: true,
              msg: "Le champs ORGANISME est obligatoire!"
            })
          );
        else {
          let vst: visiteurModel = {
            id: null,
            isAsso: null,
            nom: nom,
            organisme: org
          };
          this.visiteurService.onAddVisiteur(vst);
          inputNom.value = "";
          inputOrg.value = "";
        }
      this.isUpdate = -1;
    }
  }

  onUpdateClick(inputNom, inputOrg, i) {
    setTimeout(() => {
      this.assVstToPrjt = false;
      this.vstSelectedIndex = i;
      inputNom.disabled = false;
      inputOrg.disabled = false;
      this.isUpdate = 1;
    }, 200);
  }
  onUpdateClickOutside(inputNom, inputOrg, id, i) {
    if (this.isUpdate === 1 && this.vstSelectedIndex === i) {
      this.assVstToPrjt = true;
      let nom = inputNom.value.trim();
      let org = inputOrg.value.trim();
      let n = this.visiteurs.find(l => l.id === id).nom;
      let o = this.visiteurs.find(l => l.id === id).organisme;

      if (nom === "" || org === "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "visiteur",
            showAlert: true,
            msg: "Le champs NOM & PRENOM est obligatoire!"
          })
        );
        inputNom.value = n;
        inputOrg.value = o;
      } else {
        if (n !== nom || o !== org) {
          let vst: visiteurModel = {
            id: null,
            isAsso: null,
            nom: nom,
            organisme: org
          };
          this.visiteurService.onUpdateVisiteur(vst, id);
        }
      }
      this.isUpdate = -1;
      this.vstSelectedIndex = -1;
      inputNom.disabled = true;
      inputOrg.disabled = true;
    }
  }

  onAssoVisiteurWithProjet(id) {
    if (this.assVstToPrjt) this.visiteurService.onAssoVisiteurToProjet(id);
  }
  onDelete(id) {
    this.vstToDeleteId = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "visiteur",
        showAlert: true,
        msg: "Vous etes sure de vouloire supprimer ce visiteur?"
      })
    );
  }
  OnCancel() {
    this.store.dispatch(new fromFicheAction.Lister(false));
  }
  onContinue() {
    if (this.vstToDeleteId !== -1) {
      this.visiteurService.onDeleteVisiteur(this.vstToDeleteId);
      this.vstToDeleteId = -1;
    }

    this.onHideAlert();
  }
  onHideAlert() {
    this.vstToDeleteId = -1;
    this.vstToAssId = -1;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "visiteur",
        showAlert: false,
        msg: ""
      })
    );
  }
  getFile(event) {
    this.visiteurService.onImportExcelFileVisiteur(event.target.files[0]);
  }
}
