import { refresh } from "./../../header/head.selector";
import * as ficheLocationAction from "./../redux/fiche-location.action";
import { FicheLocationService } from "./../fiche-location.service";
import { MaterielModel } from "./../../../models/materiel.model";
import * as App from "../../../../store/app.reducers";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
import * as fromFicheLocationAction from "../redux/fiche-location.action";
import {
  matFilterKeyWord,
  matListState,
  fourListState
} from "../redux/fiche-location.selector";
import { Platform } from "@ionic/angular";
import * as _ from "lodash";
import { innerHeight } from "src/app/projet/redux/projet.selector";

@Component({
  selector: "app-materiel",
  templateUrl: "./materiel.component.html",
  styleUrls: ["./materiel.component.scss"]
})
export class MaterielComponent implements OnInit, OnDestroy {
  culumn = ["DESIGNATION", "UNITÉ"];
  @ViewChild("keyWord", { static: false })
  input;

  @ViewChild("f", { static: false })
  form: NgForm;
  materiels: MaterielModel[] = [];
  materiels$: MaterielModel[] = [];
  materiels$$: MaterielModel[] = [];

  ascendant = true;
  materielsNotAsso: MaterielModel[];
  materielsNotAsso$: MaterielModel[];
  isSearch = false;
  matSelectedId = -1;
  matId = -1;
  errorMsg = "";
  matToDeleteId = -1;
  showAlert = false;
  isUpdate = -1;
  uniteToAdd = "";
  uniteTodelete = "";
  materielToDeAssId = -1;
  uniteSelected = false;
  fournisseurIdFilter = -1;
  unites = ["H", "M2", "M3"];
  formNames = ["ds", "unite"];
  word = "";
  navPas = 5;
  position = 1;
  a = 0;
  b = this.navPas;
  DlclickMat = true;
  size;
  screenHeight;
  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.store.select(innerHeight).subscribe(state => {
      this.screenHeight = (state.innerHeight * 0.5).toString().concat("px");
    });
    this.ficheLocationService.onGetMateriel();
    this.store.select(matFilterKeyWord).subscribe(state => {
      setTimeout(() => {
        this.word = state;
        this.onFilterByMateriel(true);
      }, 0);
    });

    this.store
      .select(fourListState)
      .subscribe(
        locState =>
          (this.matSelectedId = locState.showFournisseurByMateriel.materielId)
      );
    this.store.select(matListState).subscribe(locState => {
      setTimeout(() => {
        if (locState.showMaterielByFournisseur.fournisseurNom !== "") {
          if (
            locState.showMaterielByFournisseur.fournisseurNom ===
            "MATERIEL_SANS_FOURNISSEUR"
          ) {
            this.fournisseurIdFilter = -2;
            this.materiels$$ = [...locState.materiels].filter(
              m =>
                !locState.showMaterielByFournisseur.materiels
                  .map(mm => mm.id)
                  .includes(m.id)
            );
          } else {
            this.fournisseurIdFilter =
              locState.showMaterielByFournisseur.fournisseurId;
            this.materiels$$ = [...locState.fournisseurs].find(
              f => f.id == this.fournisseurIdFilter
            ).materiels;

            this.materielsNotAsso$ = [...locState.materiels].filter(
              m => !this.materiels$$.map(mm => mm.id).includes(m.id)
            );

            this.materielsNotAsso = this.materielsNotAsso$;
          }
        } else {
          this.fournisseurIdFilter = -1;
          this.materiels$$ = this.slice(locState.materiels);
        }

        this.onFilterByMateriel(true);
      }, 0);
    });
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "materiel") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
      });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "LOCATION") {
          this.ficheLocationService.onGetMateriel();
        }
      });
  }

  OnDeleteMaterielOrDesAssoMaterielToFournisseur(id) {
    if (this.matSelectedId === id)
      if (this.fournisseurIdFilter === -1 || this.fournisseurIdFilter === -2) {
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
      } else this.OnDesAssoMaterielToFournisseur(id);
  }

  onCtnAlert() {
    if (this.materielToDeAssId !== -1 && this.fournisseurIdFilter !== -1) {
      this.ficheLocationService.OnDesAssoMaterielToFournisseur(
        this.fournisseurIdFilter,
        this.materielToDeAssId
      );
      this.materielToDeAssId = -1;
    }
    if (this.matToDeleteId !== -1 && this.fournisseurIdFilter === -1) {
      this.ficheLocationService.OnDeleteMateriel(this.matToDeleteId);

      this.matToDeleteId = -1;
    }
    this.OnAnnulerFilter();

    this.onHideAlert();
  }

  onFilterFocus() {
    this.isSearch = true;
  }

  onFilterByMateriel(init) {
    if (init) this.input.nativeElement.value = this.word.toLowerCase();

    this.word = this.input.nativeElement.value.trim().toUpperCase();
    this.materiels$ = this.materiels$$.filter(m => {
      if (m.designation.includes(this.word)) return true;
      else return false;
    });

    if (!_.isEqual(this.materiels, this.materiels$)) {
      this.materiels = this.materiels$;
      this.onSortByEnGras();
    }

    /*  let n = this.materiels$.length;
    this.materiels = this.materiels$.slice(this.a, this.b);
    this.size = Math.trunc(n / this.navPas);
    if (this.size < n / this.navPas) this.size = this.size + 1;*/
  }

  onHideAlert() {
    this.matToDeleteId = -1;
    this.isUpdate = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "materiel",
        showAlert: false,
        msg: ""
      })
    );
  }
  OnClickUpdateMateriel(dsInput, mm: MaterielModel) {
    dsInput.disabled = false;

    if (this.matId != mm.id) {
      this.matSelectedId = mm.id;
      this.matId = mm.id;
      setTimeout(() => {
        this.matId = mm.id;
      }, 0);
      setTimeout(() => {
        this.DlclickMat = false;
      }, 200);

      let m = {
        materielId: mm.id,
        materielNom: mm.designation
      };
      this.store.dispatch(new ficheLocationAction.showFournisseurByMateriel(m));
    }
  }
  OnClickOutsideUpdateMateriel(dsInput) {
    this.DlclickMat = true;
    dsInput.disabled = true;
    this.matId = -1;
  }

  OnInputAssoMaterielToFournisseur(value) {
    let word = value.toUpperCase();
    if (value.trim() === "") {
      this.materielsNotAsso = [...this.materielsNotAsso$];
    } else {
      this.materielsNotAsso = this.materielsNotAsso$.filter(f =>
        f.designation.includes(word)
      );
    }
  }

  OnFocusAssoMaterielToFournisseur(list) {
    if (this.fournisseurIdFilter > -1) list.hidden = false;
  }

  onClickAddMateriel(matDsFr) {
    if (this.matSelectedId > -1 || this.matSelectedId === -2)
      this.OnAnnulerFilter();
    else matDsFr.focus();
  }

  OnAssoMaterielToFournisseur(matDsInput, mat) {
    if (this.fournisseurIdFilter > -1) {
      if (mat != "")
        this.ficheLocationService.AssosierMaterielToFournisseurAndAddMateriel(
          this.fournisseurIdFilter,
          mat.designation
        );
    }

    matDsInput.value = "";
  }
  onAssoMaterielFournisseurToProjet(MatID) {
    if (this.DlclickMat) {
      if (this.fournisseurIdFilter > -1)
        this.ficheLocationService.onAssoMatToProjet(
          this.fournisseurIdFilter,
          MatID
        );
      else this.ficheLocationService.onAssoMatWithAllFourToProjet(MatID);
    }
  }
  OnDesAssoMaterielToFournisseur(matId) {
    if (this.fournisseurIdFilter > -1) {
      this.materielToDeAssId = matId;

      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "materiel",
          showAlert: true,
          msg:
            "Vous etes sure de vouloire desacossier ce materiel du fournisseur?"
        })
      );
    }
  }
  OnSelectFournisseurWithNoMateriel() {
    if (this.fournisseurIdFilter === -1) {
      let m = {
        materielId: -2,
        materielNom: "FOURNISSEUR_SANS_MATERIEL"
      };
      this.store.dispatch(new ficheLocationAction.showFournisseurByMateriel(m));
      this.matSelectedId = -2;
    }
  }

  onSortByEnGras() {
    // descending order z->a

    if (this.materiels !== null) {
      this.materiels = this.materiels.sort((a: MaterielModel, b) => {
        if (a.isAssoWithProjet) {
          return -1;
        } else if (b.isAssoWithProjet) {
          return 1;
        } else return 0;
      });
    }
  }

  onSort() {
    // descending order z->a
    this.ascendant = !this.ascendant;
    if (this.ascendant)
      this.materiels = this.materiels.sort((a, b) => {
        if (a.designation > b.designation) {
          return -1;
        }
        if (a.designation < b.designation) {
          return 1;
        }
        return 0;
      });
    if (!this.ascendant)
      this.materiels = this.materiels.sort((a, b) => {
        if (a.designation < b.designation) {
          return -1;
        }
        if (b.designation < a.designation) {
          return 1;
        }
        return 0;
      });
  }

  OnAnnulerFilter() {
    this.matSelectedId = -1;
    this.matId = -1;

    let m = {
      materielId: -1,
      materielNom: ""
    };
    this.store.dispatch(new ficheLocationAction.showFournisseurByMateriel(m));
  }

  OnBlurAddMateriel(matDsInput, list) {
    let mat = matDsInput.value.trim().toUpperCase();
    setTimeout(() => {
      list.hidden = true;
    }, 100);
    if (mat !== "")
      if (this.fournisseurIdFilter > -1) {
        if (!this.materiels.map(m => m.designation).includes(mat))
          this.ficheLocationService.AssosierMaterielToFournisseurAndAddMateriel(
            this.fournisseurIdFilter,
            matDsInput.value
          );
      } else {
        this.ficheLocationService.onAddMateriel(mat, "H");
      }
    matDsInput.value = "";
  }
  OnUpdateMateriel(v: string, id, vv) {
    if (v.trim().toUpperCase() !== vv)
      this.ficheLocationService.OnUpdateMateriel(v, "H", id);
  }
  slice(Dss) {
    return [...Dss].map(m => JSON.parse(JSON.stringify(m)));
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.

    this.store.dispatch(
      new fromFicheLocationAction.getMatFilterKetWord(this.word)
    );
  }
}
