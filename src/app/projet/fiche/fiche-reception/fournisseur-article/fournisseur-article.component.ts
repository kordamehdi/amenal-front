import { refresh } from "./../../header/head.selector";
import { FournisseurArticleService } from "./fournisseur-article.service";
import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { MaterielModel } from "../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { articleModel } from "src/app/projet/models/article.model";
import { fourState } from "../redux/fiche-reception.selectors";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-fournisseur-article",
  templateUrl: "./fournisseur-article.component.html",
  styleUrls: ["./fournisseur-article.component.scss"]
})
export class FournisseurArticleComponent implements OnInit, OnDestroy {
  fournisseursNonAsso: FournisseurModel[] = [];
  fournisseursNonAsso$: FournisseurModel[] = [];

  fournisseursAsso: fournisseurArticleModel[] = [];
  fournisseursAsso$: fournisseurArticleModel[] = [];

  selectedItem = {
    itemId: -1,
    itemType: "",
    itemName: ""
  };

  isFilterByArticle = false;
  fourId = -1;
  fourSelected = -1;
  fourDeleteId = -1;
  culumn = ["Fournisseur"];
  showAlert = false;
  descFr = [];
  descCat = [[]];
  errorMsg = "";
  categories: categorieModel[] = [];
  arts: articleModel[];
  isUpdate = -1;
  AssCatFr = [];
  assFrToPrjt = true;
  AssArtFr = [];
  materielFourAsso = {
    matId: -1,
    fourId: -1,
    apply: false
  };

  constructor(
    private store: Store<App.AppState>,
    private fournisseurArticleService: FournisseurArticleService
  ) {}

  ngOnInit() {
    this.fournisseurArticleService.getFournisseurNotAsso();
    this.fournisseurArticleService.getFournisseurAsso();
    this.store.select(fourState).subscribe(state => {
      //this.fourSelected = state.showArticleByFournisseurId;

      this.fournisseursNonAsso$ = state.fournisseurArticleNonAsso;
      this.categories = state.categories;
      this.selectedItem = state.showFournisseurByArticleOrCategorie;

      if (state.showFournisseurByArticleOrCategorie.itemId !== -1) {
        this.isFilterByArticle = true;
        if (state.showFournisseurByArticleOrCategorie.itemType === "ARTICLE") {
          if (state.showFournisseurByArticleOrCategorie.itemId === -2) {
            this.fournisseursAsso$ = state.fournisseurArticleAsso.filter(
              f => f.categories.length === 0
            );
          } else {
            this.fournisseursAsso$ = state.fournisseurArticleAsso.filter(f => {
              let pass = false;

              f.categories.forEach(c => {
                if (pass === false)
                  pass = c.articles
                    .map(a => a.id)
                    .includes(state.showFournisseurByArticleOrCategorie.itemId);
              });
              return pass;
            });

            this.fournisseursNonAsso$ = state.fournisseurArticleAsso.filter(
              f => !this.fournisseursAsso$.includes(f)
            );
          }
        } else if (
          state.showFournisseurByArticleOrCategorie.itemType === "CATEGORIE"
        ) {
          this.fournisseursAsso$ = state.fournisseurArticleAsso.filter(f => {
            let pass = false;
            f.categories.forEach(c => {
              if (pass === false)
                pass =
                  c.id === state.showFournisseurByArticleOrCategorie.itemId;
            });
            return pass;
          });
        }
      } else {
        this.fournisseursAsso$ = state.fournisseurArticleAsso;
        this.isFilterByArticle = false;
      }
      this.onSortByEnGras();
      this.fournisseursAsso = this.fournisseursAsso$;
      this.fournisseursNonAsso = this.fournisseursNonAsso$;
      this.calculNumberFr();
    });

    this.store.select("fiche").subscribe(state => {
      if (state.type === "fournisseur_article") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "RECEPTION") {
          this.fournisseurArticleService.getFournisseurNotAsso();
          this.fournisseurArticleService.getFournisseurAsso();
        }
      });
  }
  OnClickAddFournisseur(fourInput) {
    if (this.fourSelected !== -1) this.OnAnnulerFilter();
    else fourInput.focus();
  }

  onClickUpdateFournisseur(dsInput, four) {
    dsInput.disabled = false;

    if (this.fourSelected !== four.id) {
      setTimeout(() => {
        this.assFrToPrjt = false;
      }, 200);
      setTimeout(() => {
        this.fourId = four.id;
        this.fourSelected = four.id;
      }, 0);

      this.store.dispatch(
        new fromFicheReceptionAction.showArticleByFournisseur(four.id)
      );
    }
  }

  onAssoFourToProjet(id) {
    if (this.assFrToPrjt) this.fournisseurArticleService.onAssoFourToProjet(id);
  }

  OnBlurAddFounisseur(input, list) {
    this.isUpdate = -1;

    setTimeout(() => {
      list.hidden = true;
      let value = input.value.trim().toUpperCase();
      if (value !== "") {
        if (!this.fournisseursAsso.map(f => f.fournisseurNom).includes(value))
          this.onselectFournisseur(input, value);
        else input.value = "";
      }
    }, 100);
  }

  onselectFournisseur(f, fournisseurNom) {
    if (this.selectedItem.itemType === "ARTICLE")
      this.fournisseurArticleService.assoArticleToFournisseurAndAddFournisseur(
        fournisseurNom,
        this.selectedItem.itemId
      );
    else this.fournisseurArticleService.OnAddFournisseur(fournisseurNom);

    f.value = "";
  }

  onListBlur(list, input) {
    setTimeout(() => {
      list.hidden = true;
      input.value = "";
    }, 100);
  }

  calculNumberFr() {
    this.descFr = new Array(this.fournisseursAsso.length);
    this.descCat = new Array(this.fournisseursAsso.length);

    this.fournisseursAsso.forEach((f, i) => {
      let n = 0;
      let m = 0;
      this.descCat[i] = new Array(f.categories.length);
      f.categories.forEach((c, j) => {
        let x = 0;
        let y = 0;
        c.articles.forEach(a => {
          x = x + 1;
          m = m + 1;
          if (a.isAssoWithProjet) {
            y = y + 1;
            n = n + 1;
          }
        });
        this.descCat[i][j] = "(".concat(y.toString(), "/", x.toString(), ")");
      });
      this.descFr[i] = "(".concat(n.toString(), "/", m.toString(), ")");
    });
  }

  OnDeleteFournisseur(i, fourName) {
    if (this.fourSelected > -1) {
      let msg;
      if (this.selectedItem.itemId > -1) {
        if (this.selectedItem.itemType === "ARTICLE")
          msg =
            "vous etes sure de vouloire supprimer ce fournisseur [" +
            fourName +
            "] de l' article [" +
            this.selectedItem.itemName +
            " ]?";
        else if (this.selectedItem.itemType === "CATEGORIE")
          msg =
            "vous etes sure de vouloire supprimer ce fournisseur [" +
            fourName +
            "] de la categorie[" +
            this.selectedItem.itemName +
            " ]?";

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur_article",
            showAlert: true,
            msg: msg
          })
        );
        this.materielFourAsso.fourId = this.fourId;
        this.materielFourAsso.matId = this.selectedItem.itemId;
        this.materielFourAsso.apply = true;
      } else if (this.fournisseursAsso[i].isAssoWithProjet) {
        msg = "Ce fournisseur est associer au projet courant!";

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur_article",
            showAlert: true,
            msg: msg
          })
        );
      } else {
        msg =
          "Est ce que vous voullez vraiment supprimer les fournisseur [" +
          this.fournisseursAsso[i].fournisseurNom +
          "]?";

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "fournisseur_article",
            showAlert: true,
            msg: msg
          })
        );
      }
    }
  }

  onDelete() {
    if (this.materielFourAsso.apply) {
      if ((this.selectedItem.itemType = "CATEGORIE"))
        this.fournisseurArticleService.OnDeleteFournisseurArticleAsso(
          this.materielFourAsso.fourId,
          this.materielFourAsso.matId
        );
      this.materielFourAsso.apply = false;
    } else if (this.fourId !== -1) {
      this.fournisseurArticleService.OnDeleteFournisseurArticle(this.fourId);
    }
    this.OnAnnulerFilter();
    this.onHideAlert();
  }

  onFilterByFournisseur(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() === "")
      this.fournisseursAsso = this.slice(this.fournisseursAsso$);
    else {
      this.fournisseursAsso = this.fournisseursAsso$.filter(f => {
        if (f.fournisseurNom.includes(word)) return true;
        else return false;
      });
    }
  }
  OnInputFournisseurNonasso(keyWord) {
    let word = keyWord.toUpperCase().trim();
    if (word === "") this.fournisseursNonAsso = [...this.fournisseursNonAsso$];
    else {
      this.fournisseursNonAsso = this.fournisseursNonAsso$.filter(f => {
        if (f.fournisseurNom.includes(word)) return true;
        else return false;
      });
    }
  }

  slice(f1: fournisseurArticleModel[]) {
    let four: fournisseurArticleModel[] = [...f1].map(m =>
      JSON.parse(JSON.stringify(m))
    );

    f1.forEach((f, i) => {
      let cList = [...f.categories].map(cc => {
        let c: categorieModel = JSON.parse(JSON.stringify(cc));
        c.articles = c.articles.map(a => JSON.parse(JSON.stringify(a)));
        return c;
      });
      four[i].categories = [...cList];
    });
    return four;
  }

  onHideAlert() {
    this.AssCatFr = [];
    this.fourDeleteId = -1;
    this.AssArtFr = [];
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur_article",
        showAlert: false,
        msg: ""
      })
    );
  }
  onClickedOutside(fourUpdateInput) {
    fourUpdateInput.disabled = true;
    this.assFrToPrjt = true;
  }

  onSortByEnGras() {
    // descending order z->a
    if (this.fournisseursAsso$ !== null)
      this.fournisseursAsso$ = this.fournisseursAsso$.sort((a, b) => {
        if (a.isAssoWithProjet && b.isAssoWithProjet) return 0;
        if (a.isAssoWithProjet) {
          return -1;
        } else if (b.isAssoWithProjet) {
          return 1;
        } else return 0;
      });
  }
  OnSelectArticleWithNoFournisseur() {
    if (!this.isFilterByArticle) {
      this.fourSelected = -2;
      this.store.dispatch(
        new fromFicheReceptionAction.showArticleByFournisseur(-2)
      );
    }
  }
  OnAnnulerFilter() {
    this.fourSelected = -1;

    this.store.dispatch(
      new fromFicheReceptionAction.showArticleByFournisseur(this.fourSelected)
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
