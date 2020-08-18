import { refresh } from "./../../header/head.selector";
import * as ficheLocationAction from "./../redux/fiche-location.action";
import { MaterielModel } from "./../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FicheLocationService } from "../fiche-location.service";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";
import * as _ from "lodash";
import * as fromFicheLocationAction from "../redux/fiche-location.action";
import {
  fourFilterKeyWord,
  fourListState,
  matListState
} from "../redux/fiche-location.selector";
import { innerHeight } from "src/app/projet/redux/projet.selector";

@Component({
  selector: "app-fournisseur",
  templateUrl: "./fournisseur.component.html",
  styleUrls: ["./fournisseur.component.scss"]
})
export class FournisseurComponent implements OnInit, OnDestroy {
  @ViewChild("keyWord", { static: false })
  input;

  fournisseurs: FournisseurModel[] = [];
  fournisseurs$: FournisseurModel[] = [];
  fournisseurs$$: FournisseurModel[] = [];

  fournisseursNonAsso: FournisseurModel[];
  fournisseursNonAsso$: FournisseurModel[];

  filterType = "";
  word = "";
  fourIndex = -1;
  fourDeleteID: number;
  culumn = ["Fournisseur"];
  showAlert = false;
  ctn = false;
  errorMsg = "";
  materielFourAsso = {
    matId: -1,
    fourId: -1,
    apply: false
  };
  assFrToPrjt = true;
  materiels: MaterielModel[];
  materielsShow: MaterielModel[];
  showDetails = [];
  isSearch = false;
  isFilterByMateriel$ = false;
  matId = -1;
  oneClick = false;
  fourSelectedId = -1;
  navPas = 5;
  position = 1;
  a = 0;
  b = this.navPas;
  ascendant = false;
  size;
  screenHeight;
  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService
  ) {}

  ngOnInit() {
    this.store.select(innerHeight).subscribe(state => {
      this.screenHeight = (state.innerHeight * 0.5).toString().concat("px");
    });
    this.ficheLocationService.onGetFournisseurs();
    this.ficheLocationService.OnGetFournisseurMaterielNotAsso();

    this.store.select(fourFilterKeyWord).subscribe(state => {
      setTimeout(() => {
        this.word = state;
        this.onFilterByFournisseur(true);
      }, 0);
    });
    this.store
      .select(matListState)
      .subscribe(
        locState =>
          (this.fourSelectedId =
            locState.showMaterielByFournisseur.fournisseurId)
      );

    this.store.select(fourListState).subscribe(locState => {
      setTimeout(() => {
        this.matId = -1;
        this.fournisseursNonAsso$ = locState.fournisseurMaterielNotAsso;

        this.materiels = locState.materiels;
        if (locState.showFournisseurByMateriel.materielNom !== "") {
          if (
            locState.showFournisseurByMateriel.materielNom ==
            "FOURNISSEUR_SANS_MATERIEL"
          ) {
            this.isFilterByMateriel$ = true;
            this.fournisseurs$$ = [...locState.fournisseurs].filter(
              f => f.materiels.length == 0
            );
            this.fournisseursNonAsso$ = this.fournisseursNonAsso.concat(
              (this.fournisseurs$$ = [...locState.fournisseurs].filter(
                f => f.materiels.length == 0
              ))
            );
          } else {
            this.isFilterByMateriel$ = true;
            this.matId = locState.showFournisseurByMateriel.materielId;

            this.fournisseurs$$ = this.slice(locState.fournisseurs).filter(f =>
              f.materiels
                .map(m => m.id)
                .includes(locState.showFournisseurByMateriel.materielId)
            );

            this.fournisseurs$$.forEach(f => {
              let mat = f.materiels.find(m => m.id === this.matId);
              f.isAssoWithProjet = mat.isAssoWithProjet;
            });

            this.fournisseursNonAsso$ = this.fournisseursNonAsso.concat(
              [...locState.fournisseurs].filter(
                f =>
                  !f.materiels
                    .map(m => m.id)
                    .includes(locState.showFournisseurByMateriel.materielId)
              )
            );
          }
        } else {
          this.isFilterByMateriel$ = false;

          this.fournisseurs$$ = [...locState.fournisseurs];
        }
        this.fournisseurs$ = this.fournisseurs$$;
        this.fournisseursNonAsso = this.fournisseursNonAsso$;
        this.onSortByEnGras();

        this.onFilterByFournisseur(true);
      }, 0);
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
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "LOCATION") {
          this.ficheLocationService.onGetFournisseurs();
          this.ficheLocationService.OnGetFournisseurMaterielNotAsso();
        }
      });
  }

  OnBlurAddFounisseur(input, l) {
    setTimeout(() => {
      l.hidden = true;
      let value = input.value.trim().toUpperCase();
      if (value !== "") {
        if (!this.fournisseurs.map(f => f.fournisseurNom).includes(value))
          this.onselectFournisseur(input, value);
        else input.value = "";
      }
    }, 100);
  }
  onselectFournisseur(f, fournisseurNom) {
    if (this.matId !== -1)
      this.ficheLocationService.AssosierMaterielToFournisseurAndAddFournisseur(
        fournisseurNom,
        this.matId
      );
    else this.ficheLocationService.onAddFournisseur(fournisseurNom);
    f.value = "";
  }
  onAssoFourToProjet(id, d: boolean) {
    if (this.assFrToPrjt || d) {
      this.ficheLocationService.onAssoFourToProjet(id);
    }
  }
  OnInputfournisseur(value) {
    let word = value.toUpperCase();
    if (value.trim() === "") {
      this.fournisseursNonAsso = [...this.fournisseursNonAsso$];
    } else {
      this.fournisseursNonAsso = this.fournisseursNonAsso$.filter(f =>
        f.fournisseurNom.includes(word)
      );
    }
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
    let msg;
    if (this.fourSelectedId === fourID)
      if (this.matId > -1) {
        msg =
          "vous etes sure de vouloire supprimer ce fournisseur de ce materiel?";
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur",
            showAlert: true,
            msg: msg
          })
        );
        this.materielFourAsso.fourId = fourID;
        this.materielFourAsso.matId = this.matId;
        this.materielFourAsso.apply = true;
      } else if (this.fournisseurs[i].isAssoWithProjet) {
        msg = "Ce fournisseur est associer au projet courant!";

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur",
            showAlert: true,
            msg: msg
          })
        );
      } else {
        this.fourDeleteID = fourID;

        msg =
          "Est ce que vous voullez vraiment supprimer les fournisseur [" +
          this.fournisseurs[i].fournisseurNom +
          "]?";

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur",
            showAlert: true,
            msg: msg
          })
        );
      }
  }

  onDelete() {
    if (this.materielFourAsso.apply) {
      this.ficheLocationService.OnDesAssoMaterielToFournisseur(
        this.materielFourAsso.fourId,
        this.materielFourAsso.matId
      );
      this.materielFourAsso.apply = false;
      this.OnAnnulerFilter();
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

  onFilterByFournisseur(init: boolean) {
    if (init) this.input.nativeElement.value = this.word.toLowerCase();

    this.word = this.input.nativeElement.value.trim().toUpperCase();
    this.fournisseurs$ = this.fournisseurs$$.filter(f => {
      if (f.fournisseurNom.includes(this.word)) return true;
      else return false;
    });

    if (!init && this.word !== "") {
      this.a = 0;
      this.b = this.navPas;
      this.position = 1;
    }
    if (!_.isEqual(this.fournisseurs, this.fournisseurs$))
      this.fournisseurs = this.fournisseurs$;
    /* let n = this.fournisseurs$.length;
    this.fournisseurs = this.fournisseurs$.slice(this.a, this.b);
    this.size = Math.trunc(n / this.navPas);
    if (this.size < n / this.navPas) this.size = this.size + 1;*/
  }

  OnSelectMaterielWithNoFournisseur() {
    if (!this.isFilterByMateriel$) {
      let ms: MaterielModel[] = [];
      this.fournisseurs.forEach(f => {
        ms = ms.concat([...f.materiels]);
      });
      this.fourIndex = -2;
      this.fourSelectedId = -2;

      let p = {
        materiels: ms,
        fournisseurNom: "MATERIEL_SANS_FOURNISSEUR",
        fournisseurId: -2
      };
      this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
    }
  }

  onSort() {
    // descending order z->a
    this.ascendant = !this.ascendant;
    if (this.ascendant)
      this.fournisseurs = this.fournisseurs.sort((a, b) => {
        if (a.fournisseurNom > b.fournisseurNom) {
          return -1;
        }
        if (a.fournisseurNom < b.fournisseurNom) {
          return 1;
        }
        return 0;
      });
    if (!this.ascendant)
      this.fournisseurs = this.fournisseurs.sort((a, b) => {
        if (a.fournisseurNom < b.fournisseurNom) {
          return -1;
        }
        if (b.fournisseurNom < a.fournisseurNom) {
          return 1;
        }
        return 0;
      });
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
  onClickAddFournisseur(fourInput) {
    if (this.fourSelectedId !== -1) this.OnAnnulerFilter();
    else fourInput.focus();
  }
  OnFocusAddFounisseur(l) {
    l.hidden = false;
  }
  onClickUpdate(dsInput, i, id) {
    dsInput.disabled = false;

    if (this.fourIndex !== id) {
      setTimeout(() => {
        this.assFrToPrjt = false;
      }, 200);
      setTimeout(() => {
        this.fourIndex = id;
      }, 0);
      this.fourSelectedId = id;

      let p = {
        materiels: this.fournisseurs[i].materiels,
        fournisseurNom: this.fournisseurs[i].fournisseurNom,
        fournisseurId: this.fournisseurs[i].id
      };
      this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
    }
  }

  onClickUpdateOutside(dsInput) {
    dsInput.disabled = true;
    this.fourIndex = -1;
    this.assFrToPrjt = true;
    this.oneClick = false;
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
    this.fourSelectedId = -1;
    let p = {
      materiels: [],
      fournisseurNom: "",
      fournisseurId: -1
    };
    this.store.dispatch(new ficheLocationAction.showMaterielByFournisseur(p));
  }

  ngOnDestroy() {
    this.store.dispatch(
      new fromFicheLocationAction.getFourFilterKeyWord(this.word)
    );
  }
}
