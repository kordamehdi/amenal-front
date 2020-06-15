import { FicheMaterielService } from "./materie.service";
import { getMateriel } from "./../redux/fiche-location.action";
import { FicheLocationService } from "./../fiche-location.service";
import { MaterielModel } from "./../../../models/materiel.model";
import * as App from "../../../../store/app.reducers";
import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import * as fromProjetAction from "../../../../projet/redux/projet.actions";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-materiel",
  templateUrl: "./materiel.component.html",
  styleUrls: ["./materiel.component.scss"]
})
export class MaterielComponent implements OnInit {
  culumn = ["DESIGNATION", "UNITÉ"];

  @ViewChild("f", { static: false })
  form: NgForm;
  materiels: MaterielModel[];
  matIndex = -1;
  matDsIndex = -1;
  errorMsg = "";
  matToDeleteId = -1;
  showAlert = false;
  isUpdate = -1;
  uniteToAdd = "";
  uniteTodelete = "";
  uniteSelected = false;
  unites = ["H", "M2", "M3"];
  formNames = ["ds", "unite"];

  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService,
    private ficheMaterielService: FicheMaterielService
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetMateriel();
    this.ficheMaterielService.onGetUnite();
    this.store.select("ficheLocation").subscribe(locState => {
      this.materiels = locState.materiels;
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "materiel") {
        console.log("matmat", this.showAlert);
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  OnDeleteMateriel(id) {
    this.matToDeleteId = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "materiel",
        showAlert: true,
        msg:
          "est ce que vous voulais vraiment supprimer l' article [ " +
          this.materiels.find(mat => mat.id === id).designation +
          " ]!"
      })
    );
  }

  onCtnAlert() {
    if (this.matToDeleteId > -1) {
      this.ficheLocationService.OnDeleteMateriel(this.matToDeleteId);
      this.onHideAlert();

      this.matToDeleteId = -1;
    } else
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "materiel",
          showAlert: false,
          msg: ""
        })
      );
  }

  onHideAlert() {
    this.matToDeleteId = -1;
    this.isUpdate = -1;
    this.form.controls["unite"].reset();
    this.form.controls["ds"].reset();

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "materiel",
        showAlert: false,
        msg: ""
      })
    );
  }
  OnAddMateriel(input) {
    let v = input.value;
    this.ficheLocationService.onAddMateriel(v, "H");
    input.value = "";
  }
  OnUpdateMateriel(v, id) {
    this.ficheLocationService.OnUpdateMateriel(v, "H", id);
  }
}
