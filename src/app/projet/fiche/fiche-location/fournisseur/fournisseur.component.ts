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
import { fourListState } from "../redux/fiche-location.selector";

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
  isFilterByMateriel$ = false;
  oneClick = false;
  fourSelectedId = -1;
  navPas = 5;
  position = 1;
  a = 0;
  b = this.navPas;
  size;

  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetFournisseurs();
    this.ficheLocationService.OnGetFournisseurMaterielNotAsso();

    this.store.select(fourListState).subscribe(state => {
      setTimeout(() => {
        this.a = state.position.a;
        if (state.position.b > 0) this.b = state.position.b;
        this.position = state.position.position;
        this.word = state.filterByNom;
        this.onFilterByFournisseur(true);
      }, 0);
    });

    this.store.select("ficheLocation").subscribe(locState => {
      setTimeout(() => {
        this.fourSelectedId = locState.showMaterielByFournisseur.fournisseurId;
        this.fournisseursNonAsso = locState.fournisseurMaterielNotAsso;

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
          } else {
            this.isFilterByMateriel$ = true;

            this.fournisseurs$$ = [...locState.fournisseurs].filter(f =>
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
  }

  OnAddFounisseur(f, l) {
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
  onAssoFourToProjet(id, d: boolean) {
    console.log();
    if (this.assFrToPrjt || d) {
      this.ficheLocationService.onAssoFourToProjet(id);
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

    let n = this.fournisseurs$.length;
    this.fournisseurs = this.fournisseurs$.slice(this.a, this.b);
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
      this.fourSelectedId = -2;

      let p = {
        materiels: ms,
        fournisseurNom: "MATERIEL_SANS_FOURNISSEUR",
        fournisseurId: -2
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
  }

  onClickedOutside(dsInput, id) {
    dsInput.disabled = true;

    if (this.fourIndex === id) {
      this.fourIndex = -1;
      this.assFrToPrjt = true;
      this.oneClick = false;
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
    this.fourSelectedId = -1;
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
      this.b = this.navPas * this.position;
      this.a = this.b - this.navPas;
      this.fournisseurs = this.fournisseurs$.slice(this.a, this.b);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      this.a = this.navPas * this.position;
      this.position = this.position + 1;
      this.b = this.a + this.navPas;
      this.fournisseurs = this.fournisseurs$.slice(this.a, this.b);
    }
  }

  onClick(dsInput, i, id) {
    setTimeout(() => {
      dsInput.disabled = false;
      this.assFrToPrjt = false;
    }, 200);
    if (!this.oneClick) {
      if (!this.isFilterByMateriel$) {
        let p = {
          materiels: this.fournisseurs[i].materiels,
          fournisseurNom: this.fournisseurs[i].fournisseurNom,
          fournisseurId: this.fournisseurs[i].id
        };
        this.store.dispatch(
          new ficheLocationAction.showMaterielByFournisseur(p)
        );
        this.fourIndex = id;
        this.fourSelectedId = id;
      } else this.fourIndex = id;
    }
    this.oneClick = true;
  }
  ngOnDestroy() {
    this.store.dispatch(
      new fromFicheLocationAction.getFourListState({
        position: {
          a: this.a,
          b: this.b,
          position: this.position
        },
        filterByNom: this.word
      })
    );
  }
}
