import * as ficheLocationAction from "./../redux/fiche-location.action";
import { MaterielModel } from "./../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FicheLocationService } from "../fiche-location.service";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-fournisseur",
  templateUrl: "./fournisseur.component.html",
  styleUrls: ["./fournisseur.component.scss"]
})
export class FournisseurComponent implements OnInit, OnDestroy {
  fournisseurs: FournisseurModel[] = [];
  fournisseurs$: FournisseurModel[] = [];
  fournisseurs$$: FournisseurModel[] = [];

  fournisseursNonAsso: FournisseurModel[];

  filterType = "";
  word = "";
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
  isFilterByMateriel = false;
  isFilterByMateriel$ = false;
  oneClick = true;
  selected = -1;
  navPas = 5;
  position = 1;
  size;

  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetFournisseurs();
    this.ficheLocationService.OnGetFournisseurMaterielNotAsso();

    this.store.select("ficheLocation").subscribe(locState => {
      this.fournisseursNonAsso = locState.fournisseurMaterielNotAsso;
      this.materiels = locState.materiels;
      let ff;
      if (locState.showFournisseurByMateriel.materielNom !== "") {
        if (
          locState.showFournisseurByMateriel.materielNom ==
          "FOURNISSEUR_SANS_MATERIEL"
        ) {
          this.isFilterByMateriel$ = true;
          ff = [...locState.fournisseurs].filter(f => f.materiels.length == 0);
        } else {
          this.isFilterByMateriel$ = true;

          ff = [...locState.fournisseurs].filter(f =>
            f.materiels
              .map(m => m.id)
              .includes(locState.showFournisseurByMateriel.materielId)
          );
        }
      } else {
        this.isFilterByMateriel$ = false;

        this.fournisseurs$$ = [...locState.fournisseurs];
      }
      this.fournisseurs$ = this.fournisseurs$$;
      this.onSortByEnGras();

      this.onFilterByFournisseur(this.word);
    });
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "fournisseur") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
      });
  }

  OnaddFounisseur(f, l) {
    setTimeout(() => {
      l.hidden = true;
      if (f.value.trim() !== "") {
        this.ficheLocationService.onAddFournisseur(f.value);
        f.value = "";
      }
    }, 200);
  }
  onselectFournisseur(f, fournisseurNom) {
    this.ficheLocationService.onAddFournisseur(fournisseurNom);
    f.value = "";
  }
  onAssoFourToProjet(id, d) {
    if (this.assFrToPrjt || d) this.ficheLocationService.onAssoFourToProjet(id);
  }

  OnBlurUpdateFounisseur(fourInput, four: FournisseurModel) {
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
  }

  onShowDetails(i) {
    this.showDetails[i] = !this.showDetails[i];
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
    this.word = keyWord.toUpperCase().trim();
    if (this.word !== "FROUNISSEURS")
      if (this.word === "")
        this.fournisseurs$ = this.slice(this.fournisseurs$$);
      else {
        this.fournisseurs$ = this.fournisseurs$$.filter(f => {
          if (f.fournisseurNom.includes(this.word)) return true;
          else return false;
        });
      }
    this.position = 1;
    let n = this.fournisseurs$.length;
    this.fournisseurs = this.fournisseurs$.slice(0, this.navPas);
    this.size = Math.trunc(n / this.navPas);
    if (this.size < n / this.navPas) this.size = this.size + 1;
  }

  OnSelectMaterielWithNoFournisseur() {
    if (!this.isFilterByMateriel$) {
      let ms: MaterielModel[] = [];
      this.fournisseurs.forEach(f => {
        ms = ms.concat([...f.materiels]);
      });
      this.fourIndex = -2;
      this.selected = -2;

      let p = {
        materiels: ms,
        fournisseurNom: "MATERIEL_SANS_FOURNISSEUR",
        fournisseurId: -1
      };
      this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
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
  OnFocusAddFounisseur(l) {
    l.hidden = false;
    this.isFilterByMateriel = false;
  }

  onClickedOutside(dsInput, id) {
    dsInput.disabled = true;

    if (this.fourIndex === id) {
      this.fourIndex = -1;
      this.assFrToPrjt = true;
      this.oneClick = true;
    }
  }
  onSortByEnGras() {
    // descending order z->a
    if (this.fournisseurs$ !== null)
      this.fournisseurs$ = this.fournisseurs$.sort((a: FournisseurModel, b) => {
        if (a.isAssoWithProjet) {
          return -1;
        } else if (b.isAssoWithProjet) {
          return 1;
        } else return 0;
      });
  }
  OnAnnulerFilter() {
    this.selected = -1;
    let p = {
      materiels: [],
      fournisseurNom: "",
      fournisseurId: -1
    };
    this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
  }
  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      let a = this.navPas * this.position;
      let b = a - this.navPas;
      this.fournisseurs = this.fournisseurs$.slice(b, a);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.fournisseurs = this.fournisseurs$.slice(b, a);
    }
  }

  onClick(dsInput, i, id) {
    this.oneClick = false;
    this.isFilterByMateriel = true;
    if (!this.isFilterByMateriel$) {
      let p = {
        materiels: this.fournisseurs[i].materiels,
        fournisseurNom: this.fournisseurs[i].fournisseurNom,
        fournisseurId: this.fournisseurs[i].id
      };
      this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
      this.fourIndex = id;
      this.selected = id;
    } else this.fourIndex = id;

    setTimeout(() => {
      dsInput.disabled = false;
      this.assFrToPrjt = false;
    }, 200);
  }
  ngOnDestroy() {}
}
