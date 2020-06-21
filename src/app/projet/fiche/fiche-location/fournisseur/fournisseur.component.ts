import { MaterielModel } from "./../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit } from "@angular/core";
import { FicheLocationService } from "../fiche-location.service";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { ElementSchemaRegistry } from "@angular/compiler";

@Component({
  selector: "app-fournisseur",
  templateUrl: "./fournisseur.component.html",
  styleUrls: ["./fournisseur.component.scss"]
})
export class FournisseurComponent implements OnInit {
  fournisseurs: FournisseurModel[] = [];
  fournisseurs$: FournisseurModel[] = [];
  filterType;
  fourIndex = -1;
  fourDeleteID: number;
  culumn = ["Fournisseur"];
  showAlert = false;
  ctn = false;
  errorMsg = "";
  materielDeleteId = [];
  assFrToPrjt = true;
  materiels: MaterielModel[];
  materielsShow: MaterielModel[];
  showDetails = [];
  isSearch = false;

  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetFournisseurs();
    this.store.select("ficheLocation").subscribe(locState => {
      this.materiels = locState.materiels;
      this.fournisseurs$ = locState.fournisseurs.sort((f1, f2) => {
        if (f1.fournisseurNom < f2.fournisseurNom) {
          return -1;
        }
        if (f1.fournisseurNom > f2.fournisseurNom) {
          return 1;
        }
        return 0;
      });
      this.fournisseurs = this.slice(this.fournisseurs$);
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "fournisseur") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  OnaddFounisseur(f) {
    if (f.value.trim() !== "") {
      this.ficheLocationService.onAddFournisseur(f.value);
      f.value = "";
    }
  }
  onAssoFourToProjet(id) {
    if (this.assFrToPrjt) this.ficheLocationService.onAssoFourToProjet(id);
  }
  OnAssoMaterielToFournisseur(fourID, MatID) {
    this.ficheLocationService.OnAssoMaterielToFournisseur(fourID, MatID);
  }
  onAssoMaterielToProjet(fourId, matId) {
    this.ficheLocationService.onAssoMatToProjet(fourId, matId);
  }
  OnSearch(inputSrch, id) {
    if (inputSrch.trim() != "") {
      this.materielsShow = this.materiels.filter(m => {
        let d = false;

        this.fournisseurs[id].materiels.forEach(m1 => {
          if (m1.designation === m.designation) d = true;
        });

        return (
          !d && m.designation.toLowerCase().includes(inputSrch.toLowerCase())
        );
      });
    } else
      this.materielsShow = this.materiels.filter(m => {
        let d = false;

        this.fournisseurs[id].materiels.forEach(m1 => {
          if (m1.designation === m.designation) d = true;
        });
        return !d;
      });
  }

  OnaUpdateFounisseur(fourInput, four: FournisseurModel) {
    this.fourIndex = -1;
    if (fourInput.value.trim() !== "") {
      if (fourInput.value.trim() !== four.fournisseurNom.trim()) {
        this.ficheLocationService.OnUpdateFournisseur(fourInput.value, four.id);
      }
    } else {
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "fournisseur",
          showAlert: true,
          msg: "le nom du fournisseur est obligatoire"
        })
      );
      this.ficheLocationService.onGetFournisseurs();
    }
    fourInput.disabled = true;
  }

  onListBlur(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 100);
  }
  onShowDetails(i) {
    this.showDetails[i] = !this.showDetails[i];
  }
  onFocusInputSearch(id, list) {
    list.hidden = false;

    this.materielsShow = this.materiels.filter(m => {
      let d = false;

      this.fournisseurs[id].materiels.forEach(m1 => {
        if (m1.designation === m.designation) d = true;
      });
      return !d;
    });
  }
  calculNumber(i) {
    let j = 0;
    let g = this.fournisseurs[i].materiels.length;
    this.fournisseurs[i].materiels.forEach(m => {
      if (m.isAssoWithProjet) {
        j++;
      }
    });
    return "(" + j.toString() + "/" + g.toString() + ")";
  }
  OnDeleteFournisseur(fourID, i) {
    this.fourDeleteID = fourID;
    let msg =
      "Est ce que vous voullez vraiment supprimer les fournisseur [" +
      this.fournisseurs[i].fournisseurNom +
      "]?";
    if (this.fournisseurs[i].isAssoWithProjet) {
      msg = msg.concat(".Ce fournisseur est associer au projet courant!");
    }

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur",
        showAlert: true,
        msg: msg
      })
    );
  }

  OnDesAssoMaterielToFournisseur(fourId, matId) {
    this.materielDeleteId[0] = fourId;
    this.materielDeleteId[1] = matId;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur",
        showAlert: true,
        msg:
          "Vous etes sure de vouloire desacossier ce materiel du fournisseur?"
      })
    );
  }
  onDelete() {
    if (this.materielDeleteId.length > 0) {
      this.ficheLocationService.OnDesAssoMaterielToFournisseur(
        this.materielDeleteId[0],
        this.materielDeleteId[1]
      );
      this.materielDeleteId = [];
    } else if (this.fourDeleteID != -1) {
      if (!this.ctn) {
        this.ficheLocationService.OnDeleteFournisseur(
          this.fourDeleteID,
          this.ctn
        );
        this.ctn = true;
      } else if (this.ctn) {
        this.ficheLocationService.OnDeleteFournisseur(
          this.fourDeleteID,
          this.ctn
        );
      }
    }
    this.fourDeleteID = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur",
        showAlert: false,
        msg: ""
      })
    );
  }

  OnFilterBlur(input) {
    let v = input.value.trim();
    if (v === "") input.value = "FROUNISSEURS";
    this.isSearch = false;
  }

  onFilterFocus(input) {
    let v = input.value.trim();
    if (v === "FROUNISSEURS") input.value = "";
    this.isSearch = true;
  }

  onFilterByFournisseur(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() !== "FROUNISSEURS")
      if (keyWord.trim() === "")
        this.fournisseurs = this.slice(this.fournisseurs$);
      else {
        this.fournisseurs = this.fournisseurs$.filter(f => {
          if (f.fournisseurNom.includes(word)) return true;
          else return false;
        });
      }
  }
  onFilterByMateriel(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() !== "FROUNISSEURS")
      if (keyWord.trim() === "") {
        this.fournisseurs = this.slice(this.fournisseurs$);
      } else {
        let ff = this.slice(this.fournisseurs$);
        this.fournisseurs = ff.filter(f => {
          let isMateriel = false;
          f.materiels.forEach(m => {
            if (m.designation.includes(word)) {
              isMateriel = true;
            }
          });
          if (isMateriel) return true;
          else return false;
        });
        this.fournisseurs.forEach(f => {
          f.materiels = f.materiels.filter(m => m.designation.includes(word));
        });
      }
  }

  onHideAlert() {
    this.fourDeleteID = -1;

    this.ctn = false;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur",
        showAlert: false,
        msg: ""
      })
    );
  }
  slice(f1: FournisseurModel[]) {
    let four = [...f1].map(m => JSON.parse(JSON.stringify(m)));

    f1.forEach((f, i) => {
      let mList = [...f.materiels].map(m => JSON.parse(JSON.stringify(m)));
      four[i].materiels = [...mList];
    });
    return four;
  }
  onClickedOutside(dsInput, i) {
    this.fourIndex = -1;
    dsInput.disabled = true;
    this.assFrToPrjt = true;
  }
  onClick(dsInput, i) {
    setTimeout(() => {
      this.fourIndex = i;
      this.assFrToPrjt = false;
      dsInput.disabled = false;
    }, 200);
  }
}
