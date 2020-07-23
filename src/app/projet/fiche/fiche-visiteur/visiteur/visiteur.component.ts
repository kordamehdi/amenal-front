import { NgForm } from "@angular/forms";
import { VisiteurService } from "./visiteur.service";
import { Component, OnInit, ViewChild } from "@angular/core";
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
  @ViewChild("f", { static: false })
  form: NgForm;
  visiteurs: visiteurModel[];
  isUpdate = -1;
  vstSelectedIndex = -1;
  vstToDeleteId = -1;
  vstToAssId = -1;
  errorMsg;
  showAlert;
  assVstToPrjt = true;
  formName = ["nom", "org", "permanent"];
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

  onAddClickOutside() {
    if (this.isUpdate === 0) {
      let nom = this.form.controls["nom"].value.trim();
      let org = this.form.controls["org"].value.trim();
      let perm = this.form.controls["permanent"].value;
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
            organisme: org,
            permanent: perm
          };
          this.visiteurService.onAddVisiteur(vst);
          this.formName.forEach(n => {
            this.form.controls[n].reset();
          });
        }
      this.isUpdate = -1;
    }
  }

  onUpdateClick(id) {
    setTimeout(() => {
      this.assVstToPrjt = false;
      this.vstSelectedIndex = id;
      this.formName.forEach(n => {
        this.form.controls[n.concat(id.toString())].enable();
      });
      this.isUpdate = 1;
    }, 200);
  }
  onUpdateClickOutside(id) {
    if (this.isUpdate === 1 && this.vstSelectedIndex === id) {
      this.assVstToPrjt = true;
      let nom = this.form.controls["nom".concat(id.toString())].value.trim();
      let org = this.form.controls["org".concat(id.toString())].value.trim();
      let perm = this.form.controls["permanent".concat(id.toString())].value;
      let vs = this.visiteurs.find(l => l.id === id);

      if (nom === "" || org === "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "visiteur",
            showAlert: true,
            msg: "Le champs NOM & PRENOM est obligatoire!"
          })
        );
        this.onResetInputUpdate(id, vs);
      } else {
        if (vs.nom !== nom || vs.organisme !== org || perm !== vs.permanent) {
          let vst: visiteurModel = {
            id: null,
            isAsso: null,
            nom: nom,
            organisme: org,
            permanent: perm
          };
          this.visiteurService.onUpdateVisiteur(vst, id);
        }
      }
      this.isUpdate = -1;
      this.vstSelectedIndex = -1;
      this.formName.forEach(n => {
        this.form.controls[n.concat(id.toString())].disable();
      });
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

  onResetInputUpdate(i, vst: visiteurModel) {
    this.form.controls["nom".concat(i)].setValue(vst.nom);
    this.form.controls["org".concat(i)].setValue(vst.organisme);
    this.form.controls["permanent".concat(i)].setValue(vst.permanent);
  }
}
