import { Reset } from "./../../redux/fiche.action";
import { materiels } from "./../../fiche-location/redux/fiche-location.selector";
import { refresh } from "./../../header/head.selector";
import { FicheMaterielService } from "./../../fiche-location/materiel/materie.service";
import { articleModel } from "./../../../models/article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { ListeArticleService } from "./liste-article.service";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import { NgForm } from "@angular/forms";
import * as _ from "lodash";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { FournisseurArticleService } from "../fournisseur-article/fournisseur-article.service";
import { artState } from "../redux/fiche-reception.selectors";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-liste-article",
  templateUrl: "./liste-article.component.html",
  styleUrls: ["./liste-article.component.scss"]
})
export class ListeArticleComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  showAlert = false;

  culumn = ["DESIGNATION", "UNITÉ", "STOCKABLE"];
  formName = ["designation", "unite", "stockable"];
  errorMsg = "";
  categories: categorieModel[];
  categories$: categorieModel[] = [];
  categories$$: categorieModel[] = [];

  unites: String[] = ["H", "M3", "M2"];

  isFilter = true;

  // -1 : rien ; 0 : ajouter ; 1 : modifier
  formState = -1;
  articlesNotAssoToFr: articleModel[] = [];
  articlesNotAssoToFr$: articleModel[] = [];

  catToDeleteId = -1;
  ArticleToDeleteId = -1;
  uniteSelected = false;
  uniteToAdd = "";
  uniteTodelete;
  ArtAddIndex = "";
  CatId = -1;

  itemId = -1;
  CatSelected = -1;
  iteamType = "";
  articleSelected = "";
  Articles = [];
  ArticleUpdateIndex = "";
  filterStockable = false;
  isStockable = false;
  isFilterByFournisseur = false;
  word = "";
  showDetails: [
    {
      id: number;
      show: boolean;
    }
  ] = [
    {
      id: 0,
      show: false
    }
  ];
  fournisseurFilterId = -1;
  fournisseurFilterNom = "";
  AssCatFr = -1;
  AssArtFr = -1;
  allArtIdsAssoToFrs = [];
  constructor(
    private fournisseurArticleService: FournisseurArticleService,
    private listeArticleService: ListeArticleService,
    private ficheMaterielService: FicheMaterielService,
    private store: Store<App.AppState>
  ) {}

  ngOnInit() {
    this.listeArticleService.OnGetCategorie();
    this.ficheMaterielService.onGetUnite();
    this.store.select("ficheLocation").subscribe(locState => {
      this.unites = locState.unites;
    });
    this.store.select(artState).subscribe(state => {
      this.articlesNotAssoToFr$ = [];
      if (this.iteamType === "CATEGORIE") this.CatSelected = this.itemId;
      else if (this.iteamType === "ARTICLE") {
        if (this.itemId !== -2) {
          let catId = state.categories.find(c => {
            let pass = false;
            c.articles.forEach(a => {
              if (a.id === this.itemId) pass = true;
            });
            return pass;
          }).id;
          this.articleSelected = this.transIJ(catId, this.itemId);
        } else this.CatSelected = -2;
      }

      if (state.showArticleByFournisseurId !== -1) {
        if (state.showArticleByFournisseurId === -2) {
          this.fournisseurFilterId = -2;
          let ids = [];
          this.categories$$ = this.slice(state.categories);
          state.fournisseurArticleAsso.forEach(f => {
            f.categories.forEach(c => {
              ids = ids.concat(c.articles.map(a => a.id));
            });
          });
          this.categories$$ = this.categories$$.filter(c => {
            let pass = false;
            c.articles.forEach(a => {
              if (!ids.includes(a.id)) pass = true;
            });
            return pass;
          });
          this.categories$$.forEach(c => {
            c.articles = c.articles.filter(a => {
              return !ids.includes(a.id);
            });
          });
        } else {
          this.fournisseurFilterId = state.showArticleByFournisseurId;
          let four = state.fournisseurArticleAsso.find(
            f => f.id === this.fournisseurFilterId
          );
          this.categories$$ = this.slice(four.categories);
          this.fournisseurFilterNom = four.fournisseurNom;
          let ids = [];
          four.categories.forEach(
            c => (ids = ids.concat(c.articles.map(a => a.id)))
          );
          state.categories.forEach(
            c =>
              (this.articlesNotAssoToFr$ = this.articlesNotAssoToFr$.concat(
                c.articles
              ))
          );

          this.articlesNotAssoToFr$ = this.articlesNotAssoToFr$.filter(
            a => !ids.includes(a.id)
          );
        }
        this.articlesNotAssoToFr = this.articlesNotAssoToFr$;
        this.isFilterByFournisseur = true;
      } else if (!_.isEqual(this.categories$, state.categories)) {
        this.categories$$ = state.categories;
        this.articlesNotAssoToFr = [];
        this.articlesNotAssoToFr$ = [];
        this.isFilterByFournisseur = false;
      }
      this.showDetails = state.showDetails;
      this.categories$$.forEach(c => {
        if (this.showDetails.find(s => s.id === c.id) === undefined) {
          let s = { id: c.id, show: false };
          this.showDetails.push({ ...s });
        }
      });

      this.filter(this.word);
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "article" || state.type === "unite") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "RECEPTION") {
          this.listeArticleService.OnGetCategorie();
          this.ficheMaterielService.onGetUnite();
        }
      });
  }
  filter(vv: string) {
    this.word = vv.trim().toUpperCase();
    this.isFilter = this.word !== "" || this.filterStockable;
    this.Articles = [];
    this.onFilterByArticle(this.word);
    this.filterStk();
  }
  OnClickArticle() {}

  onClickAddCategorie() {
    if (this.itemId !== -1) this.OnAnnulerFilter();
  }

  onAddCategorie(catInput, list) {
    setTimeout(() => {
      list.hidden = true;
    }, 150);
    let value = catInput.value.trim();
    if (!this.isFilterByFournisseur || this.fournisseurFilterId === -2)
      if (value !== "") {
        this.listeArticleService.OnAddCategorie(value);
      }
    catInput.value = "";
  }

  onShowDetails(id) {
    let st = this.showDetails.find(s => s.id === id);
    st.show = !st.show;
  }
  onTestShowDetail(id) {
    let st = this.showDetails.find(s => s.id === id);
    return st.show;
  }

  onFocusUniteInput(detail) {
    detail.hidden = false;
  }

  onBlurUniteInput(detail) {
    setTimeout(() => {
      detail.hidden = true;
    }, 300);
  }

  onSelectUnite(unite, i, j) {
    let pos = "unite".concat(i, j);
    this.uniteSelected = true;
    this.form.controls[pos].setValue(unite);
  }
  onSelectAddUnite(unite, i) {
    let pos = "unite".concat(i);
    this.uniteSelected = true;
    this.form.controls[pos].setValue(unite);
  }
  onAddArticleClickOutside(i, id) {
    if (this.formState === 0 && (this.form.dirty || this.uniteSelected)) {
      let submit = true;

      this.uniteToAdd = this.form.controls["unite".concat(id.toString())].value
        .trim()
        .toUpperCase();
      if (!this.unites.includes(this.uniteToAdd)) {
        let msg;
        if (this.uniteToAdd === "") msg = "Veuillez entrez unité valide!";
        else
          msg =
            "Est ce que vous voulais  ajouté l' unité [ " +
            this.uniteToAdd +
            " ] ?";
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "article",
            showAlert: true,
            msg: msg
          })
        );
      } else {
        this.uniteSelected = false;
        this.formName.forEach(name => {
          if (
            this.form.controls[name.concat(id.toString())].invalid &&
            this.form.controls[name.concat(id.toString())].value.trim() !== ""
          )
            submit = false;
        });
        if (submit) {
          let article: articleModel = {
            id: null,
            categorieID: id,
            designation: this.form.value["designation".concat(id)],
            stockable:
              this.form.value["stockable".concat(id)] === ""
                ? false
                : this.form.value["stockable".concat(id)],
            unite: this.form.value["unite".concat(id)],
            categorie: null,
            isAssoWithProjet: null
          };
          if (this.isFilterByFournisseur && this.fournisseurFilterId > -1)
            this.listeArticleService.assoArticleToFournisseurAndAddArticle(
              this.fournisseurFilterId,
              article
            );
          else this.listeArticleService.OnAddArticle(article);
          this.form.controls["designation".concat(id)].reset();
          this.form.controls["unite".concat(id)].reset();
          this.form.controls["stockable".concat(id)].reset();
        } else {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "article",
              showAlert: true,
              msg: "Un des champs est invalid!"
            })
          );
        }
      }
      this.formState = -1;
    }
  }
  onSearchArticle(v: string) {
    let vv = v.trim().toUpperCase();
    if (vv === "") this.articlesNotAssoToFr = this.articlesNotAssoToFr$;
    else
      this.articlesNotAssoToFr = this.articlesNotAssoToFr$.filter(a =>
        a.designation.includes(vv)
      );
  }
  onAddArticleClick(i) {
    this.formState = 0;
    this.ArtAddIndex = i;
  }
  OnDeleteUnite(unite) {
    if (unite !== "H") {
      this.uniteTodelete = unite;
      this.uniteSelected = false;
      this.formState = -1;
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "article",
          showAlert: true,
          msg: "vous voulais vraiment supprimer l' unité [ " + unite + " ] ?"
        })
      );
    }
  }
  /*       UPDATE ARTICLE       */

  onClickOutsideCategorieUpdateInput(id, input) {
    if (this.CatId === id) {
      this.CatId = -1;

      let cat = this.categories.find(c => c.id === id);

      if (input.value.trim() === "") {
        this.form.controls["categorie".concat(id)].setValue(cat.categorie);
      } else if (input.value !== cat.categorie) {
        this.listeArticleService.OnEditCategorie(input.value, id);
      }

      input.disabled = true;
    }
  }

  onClickCategorieUpdateInput(cat: categorieModel, input) {
    this.itemId = cat.id;
    let item = {
      itemId: cat.id,
      itemType: "CATEGORIE",
      itemName: cat.categorie
    };
    this.iteamType = "CATEGORIE";

    this.store.dispatch(
      new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
    );
    this.CatSelected = cat.id;

    setTimeout(() => {
      this.CatId = cat.id;
      input.disabled = false;
    }, 10);
  }
  OnSelectDFournisseurWithNoArticles() {
    this.itemId = -2;
    this.iteamType = "ARTICLE";

    let item = {
      itemId: -2,
      itemType: "ARTICLE",
      itemName: ""
    };
    this.store.dispatch(
      new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
    );
    this.CatSelected = -2;
  }

  /*       UPDATE ARTICLE       */
  onClickArticleUpdateInput(catId, art: articleModel, i: number, j: number) {
    this.itemId = art.id;
    this.articleSelected = catId.toString().concat("_", art.id.toString());
    this.iteamType = "ARTICLE";
    let item = {
      itemId: art.id,
      itemType: "ARTICLE",
      itemName: art.designation
    };
    this.store.dispatch(
      new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
    );
    this.CatSelected = -1;

    this.ArticleUpdateIndex = catId.toString().concat("_", art.id.toString());
    this.uniteSelected = false;
    setTimeout(() => {
      this.formName.forEach(name => {
        this.form.controls[name.concat(this.ArticleUpdateIndex)].enable();
      });
    }, 10);
  }

  onClickOutsideArticleUpdateInput(catId, artId, i: number, j: number) {
    let index = catId.toString().concat("_", artId.toString());
    if (this.ArticleUpdateIndex === index) {
      this.ArticleUpdateIndex = "";
      if (this.articleInputDirty(index) || this.uniteSelected) {
        let submit = true;
        this.formName.forEach(name => {
          if (this.form.value[name.concat(index)] !== null)
            if (
              name !== "stockable" &&
              this.form.value[name.concat(index)].trim() === ""
            )
              submit = false;
        });

        if (!submit) {
          this.formName.forEach(name => {
            this.form.controls[name.concat(index)].setValue(
              this.categories[i].articles[j][name]
            );
            this.form.controls[name.concat(index)].disable();
          });
        } else {
          let catId = this.categories$$.find(c =>
            c.articles.map(a => a.id).includes(artId)
          ).id;
          let article: articleModel = {
            id: null,
            categorieID: catId,
            designation: this.form.value["designation".concat(index)],
            stockable: this.form.value["stockable".concat(index)],
            unite: this.form.value["unite".concat(index)],
            isAssoWithProjet: null,
            categorie: null
          };

          this.listeArticleService.OnEditArticle(article, artId);
        }
      }
    }

    this.formName.forEach(name =>
      this.form.controls[name.concat(index)].disable()
    );
  }
  OnDeleteCategorie(cat: categorieModel) {
    this.catToDeleteId = cat.id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "article",
        showAlert: true,
        msg:
          "vous etes sure de vouloire supprimer la categorie [" +
          cat.categorie +
          "] avec les articles?"
      })
    );
  }
  OnDeleteArticle(ar: articleModel) {
    this.ArticleToDeleteId = ar.id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "article",
        showAlert: true,
        msg:
          "vous etes sure de vouloire supprimer l' article[ " +
          ar.designation +
          " ] ?"
      })
    );
  }

  onFilterByArticle(keyWord: string) {
    let word = keyWord.toUpperCase();

    this.categories$ = this.slice(this.categories$$);
    if (word !== "") {
      this.Articles = this.categories$
        .map(c => c.articles)
        .reduce((r, e) => (r.push(...e), r), []);
      this.Articles = this.Articles.filter(a => a.designation.includes(word));
    } else if (!_.isEqual(this.categories$, this.categories))
      this.categories = this.categories$;
  }

  onClickOutsideFilterStockable(v) {
    this.isStockable = false;
    this.filterStockable = !this.filterStockable;
    this.filter(v);
  }

  filterStk() {
    if (this.filterStockable) {
      if (this.Articles.length === 0)
        this.Articles = this.categories$
          .map(c => c.articles)
          .reduce((r, e) => (r.push(...e), r), []);
      this.Articles = this.Articles.filter(
        a => a.stockable == this.isStockable
      );
    } else if (!_.isEqual(this.categories$, this.categories))
      this.categories = this.categories$;
  }

  filterBox(vv: string) {
    this.OnAnnulerFilter();
    this.isStockable = !this.isStockable;
    this.filter(vv);
  }

  slice(c: categorieModel[]) {
    let cat: categorieModel[] = [...c].map(m => JSON.parse(JSON.stringify(m)));

    c.forEach((f, i) => {
      let cList = [...f.articles].map(cc => JSON.parse(JSON.stringify(cc)));
      cat[i].articles = [...cList];
    });
    return cat;
  }
  onfocusAddArticle(list) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2)
      list.hidden = false;
  }
  OnAssoArticleToFournisseur(artId, catInput) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
      this.fournisseurArticleService.assoArticleToFournisseur(
        this.fournisseurFilterId,
        artId
      );
      catInput.value = "";
    }
  }
  transIJ(i: number, j) {
    return i.toString().concat("_", j.toString());
  }
  assoArticleFournisseurToProjet(matId) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2)
      this.fournisseurArticleService.assoArticleFournisseurToProjet(
        this.fournisseurFilterId,
        matId
      );
    else this.fournisseurArticleService.assoArticleToProjet(matId);
  }
  deleteAssoArticleFournisseur(art: articleModel, catId) {
    if (this.articleSelected === this.transIJ(catId, art.id))
      if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
        this.AssArtFr = art.id;

        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "article",
            showAlert: true,
            msg:
              "Est ce que vous etes sure de vouloire supprimer l'article [ " +
              art.designation +
              " ] du fournisseur [ " +
              this.fournisseurFilterNom +
              " ] "
          })
        );
      } else this.OnDeleteArticle(art);
  }
  assoCategorieFournisseurToProjet(catId) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2)
      this.fournisseurArticleService.assoCategorieFournisseurToProjet(
        this.fournisseurFilterId,
        catId
      );
    else this.fournisseurArticleService.assoCategorieToProjet(catId);
  }
  deleteAssoCategorieFournisseur(cat) {
    if (this.CatSelected === cat.id)
      if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
        this.AssCatFr = cat.id;
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "article",
            showAlert: true,
            msg:
              "Est ce que vous etes sure de vouloire supprimer la categorier [ " +
              cat.categorie +
              " ] du fournisseur [ " +
              this.fournisseurFilterNom +
              " ] "
          })
        );
      } else this.OnDeleteCategorie(cat);
  }
  OnAnnulerFilter() {
    this.iteamType = "";
    this.itemId = -1;
    let item = {
      itemId: -1,
      itemType: "",
      itemName: ""
    };
    this.store.dispatch(
      new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
    );

    this.articleSelected = "";
    this.CatSelected = -1;
  }
  /*              */
  onDelete() {
    if (this.AssArtFr !== -1) {
      this.fournisseurArticleService.OnDeleteFournisseurArticleAsso(
        this.fournisseurFilterId,
        this.AssArtFr
      );
    } else if (this.AssCatFr !== -1) {
      this.fournisseurArticleService.OnDeleteFournisseurCategorieAsso(
        this.AssCatFr,
        this.fournisseurFilterId
      );
    } else if (this.catToDeleteId !== -1) {
      this.listeArticleService.OnDeleteCategorie(this.catToDeleteId);
    } else if (this.ArticleToDeleteId !== -1) {
      this.listeArticleService.OnDeleteArticle(this.ArticleToDeleteId);
    } else if (this.uniteToAdd != "") {
      this.form.controls["unite".concat(this.ArtAddIndex)].setValue(
        this.uniteToAdd.toUpperCase()
      );
      this.ficheMaterielService.onAddUnite(this.uniteToAdd.toUpperCase());
    } else if (this.uniteTodelete !== "") {
      this.ficheMaterielService.onDeleteUnite(this.uniteTodelete);
    }
    this.OnAnnulerFilter();
    this.onHideAlert();
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "article",
        showAlert: false,
        msg: ""
      })
    );
    this.uniteToAdd = "";
    this.AssCatFr = -1;
    this.AssArtFr = -1;
    this.ArticleToDeleteId = -1;
    this.catToDeleteId = -1;
    this.uniteToAdd = "";
  }

  articleInputDirty(index) {
    return (
      this.form.controls["designation".concat(index)].dirty ||
      this.form.controls["stockable".concat(index)].dirty
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
    /*  this.store.dispatch(
      new fromFicheReceptionAction.showDetailCatArticle(this.showDetails)
    );*/
  }
}
