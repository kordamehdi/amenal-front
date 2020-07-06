import { FicheMaterielService } from "./../../fiche-location/materiel/materie.service";
import { articleModel } from "./../../../models/article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { ListeArticleService } from "./liste-article.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import { NgForm } from "@angular/forms";
import * as _ from "lodash";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { FournisseurArticleService } from "../fournisseur-article/fournisseur-article.service";

@Component({
  selector: "app-liste-article",
  templateUrl: "./liste-article.component.html",
  styleUrls: ["./liste-article.component.scss"]
})
export class ListeArticleComponent implements OnInit {
  @ViewChild("f", { static: false })
  form: NgForm;
  showAlert = false;

  culumn = ["DESIGNATION", "UNITÉ", "STOCKABLE"];
  formName = ["designation", "unite", "stockable"];
  errorMsg = "";
  categories: categorieModel[];
  categories$: categorieModel[];
  unites: String[] = ["H", "M3", "M2"];
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
  CatIndex = -1;
  CatId = -1;
  CatSelected = -1;
  articleSelected = "";

  ArticleUpdateIndex = "";
  filterStockable = false;
  isStockable = false;
  isFilterByFournisseur = false;
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
    this.store.select("ficheReception").subscribe(state => {
      if (state.showArticleByFournisseurId !== -1) {
        if (state.showArticleByFournisseurId === -2) {
          this.fournisseurFilterId = -2;
          let ids = [];
          this.categories$ = this.slice(state.categories);
          state.fournisseurArticleAsso.forEach(f => {
            f.categories.forEach(c => {
              ids = ids.concat(c.articles.map(a => a.id));
            });
          });
          this.categories$ = this.categories$.filter(c => {
            let pass = false;
            c.articles.forEach(a => {
              pass = !ids.includes(a.id);
            });
            return pass;
          });
          this.categories$.forEach(c => {
            c.articles = c.articles.filter(a => {
              return !ids.includes(a.id);
            });
          });
        } else {
          this.fournisseurFilterId = state.showArticleByFournisseurId;
          let four = state.fournisseurArticleAsso.find(
            f => f.id === this.fournisseurFilterId
          );
          this.categories$ = four.categories;
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
      } else {
        this.articlesNotAssoToFr = [];
        this.articlesNotAssoToFr$ = [];

        this.categories$ = state.categories;
        this.isFilterByFournisseur = false;
      }
      this.categories = this.categories$;
      this.categories.forEach(c => {
        if (this.showDetails.find(s => s.id === c.id) === undefined) {
          let s = { id: c.id, show: false };
          this.showDetails.push({ ...s });
        }
      });
      if (typeof this.form !== "undefined") {
        let ds = this.form.value["DESIGNATION$"];
        let type = this.form.value["type"];
        this.filter(ds, type);
      }
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "article" || state.type === "unite") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onAddCategorie(catInput, list) {
    setTimeout(() => {
      list.hidden = true;
    }, 150);
    let value = catInput.value.trim();
    if (!this.isFilterByFournisseur || this.fournisseurFilterId === -2)
      if (value !== "") {
        this.listeArticleService.OnAddCategorie(value);
        catInput.value = "";
      }
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
            this.form.controls[name.concat(id)].invalid &&
            this.form.controls[name.concat(id)].value.trim() !== ""
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
          this.listeArticleService.OnAddArticle(article);
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

  onClickOutsideCategorieUpdateInput(i, id, input) {
    this.CatIndex = -1;
    this.CatId = -1;

    if (input.value.trim() === "") {
      this.form.controls["categorie".concat(id)].setValue(
        this.categories[i].categorie
      );
    } else if (input.value !== this.categories[i].categorie) {
      this.listeArticleService.OnEditCategorie(
        input.value,
        this.categories[i].id
      );
    }

    input.disabled = true;
  }

  onClickCategorieUpdateInput(i, id, input) {
    if (!this.isFilterByFournisseur) {
      let item = {
        itemId: id,
        itemType: "CATEGORIE"
      };
      this.store.dispatch(
        new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
      );
      this.CatSelected = id;
    }
    setTimeout(() => {
      this.CatIndex = i;
      this.CatId = id;
      input.disabled = false;
    }, 10);
  }
  OnSelectDFournisseurWithNoArticles() {
    if (!this.isFilterByFournisseur) {
      let item = {
        itemId: -2,
        itemType: "ARTICLE"
      };
      this.store.dispatch(
        new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
      );
      this.CatSelected = -2;
    }
  }

  /*       UPDATE ARTICLE       */
  onClickArticleUpdateInput(catId, artId, i: number, j: number) {
    if (!this.isFilterByFournisseur) {
      this.articleSelected = catId.toString().concat("_", artId.toString());
      let item = {
        itemId: artId,
        itemType: "ARTICLE"
      };
      this.store.dispatch(
        new fromFicheReceptionAction.showFournisseurByArticleOrCategorie(item)
      );
      this.CatSelected = catId;
    }
    this.ArticleUpdateIndex = catId.toString().concat("_", artId.toString());
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
      if (this.form.dirty || this.uniteSelected) {
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
          let article: articleModel = {
            id: null,
            categorieID: this.categories[i].id,
            designation: this.form.value["designation".concat(index)],
            stockable: this.form.value["stockable".concat(index)],
            unite: this.form.value["unite".concat(index)],
            isAssoWithProjet: null,
            categorie: null
          };

          this.listeArticleService.OnEditArticle(
            article,
            this.categories[i].articles[j].id
          );
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
  OnFilterBlur(input) {
    let v = input.value.trim();
    if (v === "") input.value = "DESIGNATION";
  }

  onFilterFocus(input) {
    let v = input.value.trim();
    if (v === "DESIGNATION") input.value = "";
  }
  onFilterByArticle(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() !== "DESIGNATION")
      if (keyWord.trim() === "") {
        this.categories = this.slice(this.categories$);
      } else {
        let ff = this.slice(this.categories$);
        this.categories = ff.filter(f => {
          let isMateriel = false;
          f.articles.forEach(m => {
            if (m.designation.includes(word)) {
              isMateriel = true;
            }
          });
          if (isMateriel) return true;
          else return false;
        });
        this.categories.forEach(f => {
          f.articles = f.articles.filter(m => m.designation.includes(word));
        });
      }
  }

  onFilterByCategorie(keyWord: string) {
    let word = keyWord.toUpperCase();
    if (keyWord.trim() !== "DESIGNATION")
      if (keyWord.trim() === "") this.categories = this.slice(this.categories$);
      else {
        let ff = this.slice(this.categories$);
        this.categories = ff.filter(c => c.categorie.includes(word));
      }
  }

  onClickOutsideFilterStockable(v, type) {
    this.isStockable = false;
    this.filterStockable = !this.filterStockable;
    this.filter(v, type);
  }

  filterStk() {
    let ff = this.slice(this.categories);
    this.categories = ff.filter(f => {
      let isMateriel = false;
      f.articles.forEach(m => {
        if (m.stockable == this.isStockable) {
          isMateriel = true;
        }
      });
      if (isMateriel) return true;
      else return false;
    });
    this.categories.forEach(f => {
      f.articles = f.articles.filter(m => m.stockable == this.isStockable);
    });
  }
  filter(vv: string, type) {
    this.categories = this.slice(this.categories$);
    let v = vv.trim().toUpperCase();
    if (this.filterStockable) {
      if (type == "A") this.onFilterByArticle(v);
      else this.onFilterByCategorie(v);
      this.filterStk();
    } else {
      if (type == "A") this.onFilterByArticle(v);
      else this.onFilterByCategorie(v);
    }
  }
  filterBox(vv: string, type) {
    this.categories = this.slice(this.categories$);

    this.isStockable = !this.isStockable;
    let v = vv.trim().toUpperCase();
    if (this.filterStockable) {
      if (type == "A") this.onFilterByArticle(v);
      else this.onFilterByCategorie(v);
      this.filterStk();
    } else {
      if (type == "A") this.onFilterByArticle(v);
      else this.onFilterByCategorie(v);
    }
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
  OnAssoArticleToFournisseur(artID, catInput) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
      this.fournisseurArticleService.assoArticleToFournisseur(
        this.fournisseurFilterId,
        artID
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
  }
  deleteAssoArticleFournisseur(artId, artName) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
      this.AssArtFr = artId;

      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "article",
          showAlert: true,
          msg:
            "Est ce que vous etes sure de vouloire supprimer l'article [ " +
            artName +
            " ] du fournisseur [ " +
            this.fournisseurFilterNom +
            " ] "
        })
      );
    }
  }
  assoCategorieFournisseurToProjet(catId) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2)
      this.fournisseurArticleService.assoCategorieFournisseurToProjet(
        this.fournisseurFilterId,
        catId
      );
  }
  deleteAssoCategorieFournisseur(catId, cat) {
    if (this.isFilterByFournisseur && this.fournisseurFilterId !== -2) {
      this.AssCatFr = catId;
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "article",
          showAlert: true,
          msg:
            "Est ce que vous etes sure de vouloire supprimer la categorier [ " +
            cat +
            " ] du fournisseur [ " +
            this.fournisseurFilterNom +
            " ] "
        })
      );
    }
  }
  OnAnnulerFilter() {
    let item = {
      itemId: -1,
      itemType: ""
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
    //this.onHideAlert();
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
}
