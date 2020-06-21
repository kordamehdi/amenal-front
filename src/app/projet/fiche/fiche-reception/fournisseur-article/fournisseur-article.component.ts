import { FournisseurArticleService } from "./fournisseur-article.service";
import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { MaterielModel } from "../../../models/materiel.model";
import { FournisseurModel } from "../../../models/fournisseur-materiel.model";
import { Component, OnInit } from "@angular/core";

import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { FicheLocationService } from "../../fiche-location/fiche-location.service";
import { ListeArticleService } from "../liste-article/liste-article.service";
import { articleModel } from "src/app/projet/models/article.model";
import { of } from "rxjs";
import { isTabSwitch } from "@ionic/angular/dist/directives/navigation/stack-utils";

@Component({
  selector: "app-fournisseur-article",
  templateUrl: "./fournisseur-article.component.html",
  styleUrls: ["./fournisseur-article.component.scss"]
})
export class FournisseurArticleComponent implements OnInit {
  fournisseursNonAsso: FournisseurModel[] = [];
  fournisseursAsso: fournisseurArticleModel[] = [];
  fournisseursAsso$: fournisseurArticleModel[] = [];

  fourIndex = -1;
  lastFourIndexSelected = -1;
  fourDeleteId = -1;
  culumn = ["Fournisseur"];
  showAlert = false;
  descFr = [];
  descCat = [[]];
  errorMsg = "";
  categories: categorieModel[] = [];
  showCategorie = [];
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
      this.fournisseursNonAsso = state.fournisseurArticleNonAsso;
      this.categories = state.categories;
      this.fournisseursAsso = state.fournisseurArticleAsso;
      this.fournisseursAsso$ = state.fournisseurArticleAsso;

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
  OnAssoArticleToFournisseur(fourID, artID) {
    this.fournisseurArticleService.assoArticleToFournisseur(fourID, artID);
  }
  assoCategorieFournisseurToProjet(fourId, catId) {
    this.fournisseurArticleService.assoCategorieFournisseurToProjet(
      fourId,
      catId
    );
  }
  assoArticleFournisseurToProjet(fourId, matId) {
    this.fournisseurArticleService.assoArticleFournisseurToProjet(
      fourId,
      matId
    );
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
  onShowCategories(i) {
    this.showCategorie[i] = !this.showCategorie[i];
    if (!this.showCategorie[i]) {
    }
    this.fournisseursAsso[i].categories.forEach(cat => (cat.show = false));
  }
  onShowDetails(cat) {
    cat.show = !cat.show;
  }
  onFocusInputSearch(i, list) {
    let art = [];
    let artss = [];
    this.categories.forEach(c => {
      art = [...art, ...c.articles];
    });

    this.fournisseursAsso[i].categories.forEach(c => {
      artss = [...artss, ...c.articles];
    });
    this.arts = art.filter(a => {
      return typeof artss.find(aa => aa.id === a.id) === "undefined";
    });

    list.hidden = false;
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
      this.onHideAlert();
    } else if (this.AssCatFr.length > 0) {
      this.fournisseurArticleService.OnDeleteFournisseurCategorieAsso(
        this.AssCatFr[1],
        this.AssCatFr[0]
      );
      this.AssCatFr = [];
    } else if (this.AssArtFr.length > 0) {
      this.fournisseurArticleService.OnDeleteFournisseurArticleAsso(
        this.AssArtFr[1],
        this.AssArtFr[0]
      );
      this.onHideAlert();
    } else {
      this.onHideAlert();
    }
  }
  deleteAssoCategorieFournisseur(fourId, catId, fr, cat) {
    this.AssCatFr = [catId, fourId];
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur_article",
        showAlert: true,
        msg:
          "Est ce que vous etes sure de vouloire supprimer la categorier [ " +
          cat +
          " ] du fournisseur [ " +
          fr +
          " ] "
      })
    );
  }
  deleteAssoArticleFournisseur(fourId, artId, fr, art) {
    this.AssArtFr = [artId, fourId];
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "fournisseur_article",
        showAlert: true,
        msg:
          "Est ce que vous etes sure de vouloire supprimer l'article [ " +
          art +
          " ] du fournisseur [ " +
          fr +
          " ] "
      })
    );
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
  onFilterByArticle(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() === "") {
      this.fournisseursAsso = this.slice(this.fournisseursAsso$);
    } else {
      let ff = this.slice(this.fournisseursAsso$);
      this.fournisseursAsso = ff.filter(f => {
        let isMateriel = false;
        f.categories.forEach(c => {
          c.articles.forEach(a => {
            if (a.designation.includes(word)) {
              isMateriel = true;
            }
          });
        });
        if (isMateriel) return true;
        else return false;
      });
      this.fournisseursAsso.forEach(f => {
        f.categories = f.categories.filter(c => {
          let isCat = false;
          c.articles.forEach(a => {
            if (a.designation.includes(word)) isCat = true;
            else isCat = false;
          });
          return isCat;
        });
      });
      this.fournisseursAsso.forEach(f => {
        f.categories.forEach(c => {
          c.articles = c.articles.filter(m => m.designation.includes(word));
        });
      });
    }
  }

  onFilterByCategorie(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() === "") {
      this.fournisseursAsso = this.slice(this.fournisseursAsso$);
    } else {
      let ff = this.slice(this.fournisseursAsso$);
      this.fournisseursAsso = ff.filter(f => {
        let isCat = false;
        f.categories.forEach(c => {
          if (c.categorie.includes(word)) {
            isCat = true;
          }
        });
        return isCat;
      });
      this.fournisseursAsso.forEach(f => {
        f.categories = f.categories.filter(c => {
          return c.categorie.includes(word);
        });
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
  onClickedOutside(i) {
    this.fourIndex = -1;
  }
  onClick(i) {
    setTimeout(() => {
      this.fourIndex = i;
      this.lastFourIndexSelected = i;
    }, 10);
  }
}
