import { FournisseurArticleService } from "./fournisseur-article.service";
import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { MaterielModel } from "../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit } from "@angular/core";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { articleModel } from "src/app/projet/models/article.model";

@Component({
  selector: "app-fournisseur-article",
  templateUrl: "./fournisseur-article.component.html",
  styleUrls: ["./fournisseur-article.component.scss"]
})
export class FournisseurArticleComponent implements OnInit {
  fournisseursNonAsso: FournisseurModel[] = [];
  fournisseursAsso: fournisseurArticleModel[] = [];
  fournisseursAsso$: fournisseurArticleModel[] = [];
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

  AssCatFr = [];

  AssArtFr = [];

  constructor(
    private store: Store<App.AppState>,
    private fournisseurArticleService: FournisseurArticleService
  ) {}

  ngOnInit() {
    this.fournisseurArticleService.getFournisseurNotAsso();
    this.fournisseurArticleService.getFournisseurAsso();
    this.store.select("ficheReception").subscribe(state => {
      this.fourSelected = state.showArticleByFournisseurId;

      this.fournisseursNonAsso = state.fournisseurArticleNonAsso;
      this.categories = state.categories;
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
      this.calculNumberFr();
    });

    this.store.select("fiche").subscribe(state => {
      if (state.type === "fournisseur_article") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  OnaddFounisseur(fr) {
    let id = -1;
    if (fr.value.trim() !== "") {
      console.log("ddddd : ", fr.value.trim());
      this.fournisseursNonAsso.forEach(element => {
        if (element.fournisseurNom === fr.value) id = element.id;
      });
      this.fournisseurArticleService.OnAddFournisseur(id, fr.value);
      fr.value = "";
    }
  }
  onAssoFourToProjet(id) {
    this.fournisseurArticleService.onAssoFourToProjet(id);
  }

  onBlurAddFr(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 100);
  }
  onselectFournisseur(fournisseurNom, input) {
    input.value = fournisseurNom;
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
  OnDeleteFournisseur(four: fournisseurArticleModel) {
    this.fourDeleteId = four.id;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur_article",
        showAlert: true,
        msg:
          "Vous etes sure de vouloire supprimer e fournisseur [ " +
          four.fournisseurNom +
          " ]?"
      })
    );
  }

  onDelete() {
    if (this.fourDeleteId !== -1) {
      this.fournisseurArticleService.OnDeleteFournisseurArticle(
        this.fourDeleteId
      );
    }
    this.onHideAlert();
  }

  OnFilterBlur(input) {
    let v = input.value.trim();
    if (v === "") input.value = "FROUNISSEURS";
  }

  onFilterFocus(input) {
    let v = input.value.trim();
    if (v === "FROUNISSEURS") input.value = "";
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
  onClickedOutside(id) {
    this.fourId = -1;
  }
  onClick(index, id) {
    if (!this.isFilterByArticle) {
      this.fourSelected = id;
      this.store.dispatch(
        new fromFicheReceptionAction.showArticleByFournisseur(
          this.fournisseursAsso[index].id
        )
      );
    }

    setTimeout(() => {
      this.fourId = id;
    }, 10);
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
}
