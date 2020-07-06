import { FicheMaterielService } from "./materie.service";
import * as ficheLocationAction from "./../redux/fiche-location.action";
import { FicheLocationService } from "./../fiche-location.service";
import { MaterielModel } from "./../../../models/materiel.model";
import * as App from "../../../../store/app.reducers";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import * as fromProjetAction from "../../../../projet/redux/projet.actions";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-materiel",
  templateUrl: "./materiel.component.html",
  styleUrls: ["./materiel.component.scss"]
})
export class MaterielComponent implements OnInit, OnDestroy {
  culumn = ["DESIGNATION", "UNITÉ"];

  @ViewChild("f", { static: false })
  form: NgForm;
  materiels: MaterielModel[];
  materiels$: MaterielModel[];
  materiels$$: MaterielModel[];

  ascendant = false;
  materielsNotAsso: MaterielModel[];
  materielsNotAsso$: MaterielModel[];
  isSearch = false;
  matIndex = -1;
  matDsIndex = -1;
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
  assArtToPrjt = true;
  navPas = 5;
  position = 1;
  size;

  constructor(
    private store: Store<App.AppState>,
    private ficheLocationService: FicheLocationService,
    private ficheMaterielService: FicheMaterielService
  ) {}

  ngOnInit() {
    this.ficheLocationService.onGetMateriel();
    this.ficheMaterielService.onGetUnite();

    this.store.select("ficheLocation").subscribe(locState => {
      if (locState.showMaterielByFournisseur.fournisseurNom !== "") {
        if (
          locState.showMaterielByFournisseur.fournisseurNom ===
          "MATERIEL_SANS_FOURNISSEUR"
        ) {
          this.fournisseurIdFilter = -2;
          this.matIndex = -1;
          this.materiels$$ = [...locState.materiels].filter(
            m =>
              !locState.showMaterielByFournisseur.materiels
                .map(mm => mm.id)
                .includes(m.id)
          );
          this.materielsNotAsso = this.materielsNotAsso$;
        } else {
          this.fournisseurIdFilter =
            locState.showMaterielByFournisseur.fournisseurId;
          this.matIndex = -1;
          this.materiels$$ = [...locState.materiels]
            .filter(m =>
              locState.showMaterielByFournisseur.materiels
                .map(mm => mm.id)
                .includes(m.id)
            )
            .map(m => {
              return { ...m };
            });
          this.materielsNotAsso$ = [...locState.materiels].filter(
            m =>
              !locState.showMaterielByFournisseur.materiels
                .map(mm => mm.id)
                .includes(m.id)
          );
          this.materielsNotAsso = this.materielsNotAsso$;

          locState.showMaterielByFournisseur.materiels.forEach(mm => {
            let m = this.materiels$.find(m => m.id == mm.id);
            m.isAssoWithProjet = mm.isAssoWithProjet;
          });
          this.onSortByEnGras();
        }
      } else {
        this.fournisseurIdFilter = -1;
        this.materiels$$ = [...locState.materiels];
        this.materiels$$ = this.materiels$$.sort((a, b) => {
          if (a.designation < b.designation) {
            return -1;
          }
          if (a.designation > b.designation) {
            return 1;
          }
          return 0;
        });
      }
      this.materiels$ = this.materiels$$;

      this.onFilterByMateriel(this.word);
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
    if (this.materielToDeAssId !== -1 && this.fournisseurIdFilter !== -1) {
      this.ficheLocationService.OnDesAssoMaterielToFournisseur(
        this.fournisseurIdFilter,
        this.materielToDeAssId
      );
      this.materielToDeAssId = -1;
    }
    if (this.matToDeleteId !== -1 && this.fournisseurIdFilter === -1) {
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

  onFilterFocus() {
    this.isSearch = true;
  }

  onFilterByMateriel(keyWord: string) {
    this.word = keyWord.toUpperCase().trim();
    if (this.word === "") {
      this.materiels$ = [...this.materiels$$];
    } else {
      this.materiels$ = this.materiels$$.filter(f => {
        if (f.designation.includes(this.word)) return true;
        else return false;
      });
    }
    this.position = 1;
    let n = this.materiels$.length;
    this.materiels = this.materiels$.slice(0, this.navPas);
    this.size = Math.trunc(n / this.navPas);
    if (this.size < n / this.navPas) this.size = this.size + 1;
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
  OnClickMateriel(dsInput, mm: MaterielModel) {
    if (this.fournisseurIdFilter === -1) {
      this.matIndex = mm.id;
      let m = {
        materielId: mm.id,
        materielNom: mm.designation
      };
      this.store.dispatch(new ficheLocationAction.showFournisseurByMateriel(m));
      this.matDsIndex = mm.id;
    } else this.matDsIndex = mm.id;
    setTimeout(() => {
      dsInput.disabled = false;
      this.assArtToPrjt = false;
    }, 200);
  }
  OnClickOutsideMateriel(dsInput, i) {
    if (i == this.matDsIndex) {
      this.matDsIndex = -1;
      dsInput.disabled = true;
      this.assArtToPrjt = true;
    }
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

  OnBlurAssoMaterielToFournisseur(matDsInput) {
    setTimeout(() => {
      matDsInput.hidden = true;
    }, 100);
  }

  OnFocusAssoMaterielToFournisseur(list) {
    list.hidden = false;
  }

  OnAssoMaterielToFournisseur(MatID, input) {
    if (
      this.assArtToPrjt &&
      (this.fournisseurIdFilter !== -1 && this.fournisseurIdFilter !== -2)
    )
      this.ficheLocationService.OnAssoMaterielToFournisseur(
        this.fournisseurIdFilter,
        MatID
      );
    input.value = "";
  }
  onAssoMaterielFournisseurToProjet(MatID) {
    if (this.fournisseurIdFilter !== -1 && this.fournisseurIdFilter !== -2)
      this.ficheLocationService.onAssoMatToProjet(
        this.fournisseurIdFilter,
        MatID
      );
  }
  OnDesAssoMaterielToFournisseur(matId) {
    if (this.fournisseurIdFilter !== -1 && this.fournisseurIdFilter !== -2) {
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
      this.matIndex = -2;
    }
  }
  onPrevious() {
    if (this.position - 1 > 0) {
      this.position = this.position - 1;
      let a = this.navPas * this.position;
      let b = a - this.navPas;
      this.materiels = this.materiels$.slice(b, a);
    }
  }
  onNext() {
    if (this.position + 1 <= this.size) {
      let b = this.navPas * this.position;
      this.position = this.position + 1;
      let a = b + this.navPas;
      this.materiels = this.materiels$.slice(b, a);
    }
  }

  onSortByEnGras() {
    // descending order z->a
    if (this.materiels$ !== null)
      this.materiels$ = this.materiels$.sort((a: MaterielModel, b) => {
        if (a.isAssoWithProjet) {
          return -1;
        } else if (b.isAssoWithProjet) {
          return 1;
        } else return 0;
      });
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
    this.matIndex = -1;
    let m = {
      materielId: -1,
      materielNom: ""
    };
    this.store.dispatch(new ficheLocationAction.showFournisseurByMateriel(m));
  }

  OnAddMateriel(input) {
    let v = input.value;
    if (v !== "") this.ficheLocationService.onAddMateriel(v, "H");
    input.value = "";
  }
  OnUpdateMateriel(v: string, id, vv) {
    if (v.trim().toUpperCase() !== vv)
      this.ficheLocationService.OnUpdateMateriel(v, "H", id);
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
