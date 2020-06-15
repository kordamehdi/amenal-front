import { FicheMaterielService } from "./../../fiche-location/materiel/materie.service";
import { articleModel } from "./../../../models/article.model";
import { categorieModel } from "./../../../models/categorie.model";
import { ListeArticleService } from "./liste-article.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import { NgForm } from "@angular/forms";

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
  unites: String[] = ["H", "M3", "M2"];
  // -1 : rien ; 0 : ajouter ; 1 : modifier
  formState = -1;
  catToDeleteId = -1;
  ArticleToDeleteId = -1;
  uniteSelected = false;
  uniteToAdd = "";
  uniteTodelete;
  ArtAddIndex = "";
  CatIndex = -1;

  ArticleUpdateIndex = "";

  showDetails = [];

  constructor(
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
      this.categories = state.categories;
    });
    this.store.select("fiche").subscribe(state => {
      if (state.type === "article" || state.type === "unite") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onAddCategorie(value) {
    if (value.trim() !== "") {
      this.listeArticleService.OnAddCategorie(value);
      this.form.controls["cat"].setValue("");
    }
  }
  onCategorieInputClick() {}

  onShowDetails(i) {
    this.showDetails[i] = !this.showDetails[i];
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

      this.uniteToAdd = this.form.controls["unite".concat(i.toString())].value
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
            this.form.controls[name.concat(i)].invalid &&
            this.form.controls[name.concat(i)].value.trim() !== ""
          )
            submit = false;
        });
        if (submit) {
          let article: articleModel = {
            id: null,
            categorieID: id,
            designation: this.form.value["designation".concat(i)],
            stockable:
              this.form.value["stockable".concat(i)] === ""
                ? false
                : this.form.value["stockable".concat(i)],
            unite: this.form.value["unite".concat(i)],
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

  onClickOutsideCategorieUpdateInput(i, input) {
    this.CatIndex = -1;

    if (input.value.trim() === "") {
      this.form.controls["categorie".concat(i)].setValue(
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

  onClickCategorieUpdateInput(i, input) {
    setTimeout(() => {
      this.CatIndex = i;
      input.disabled = false;
    }, 10);
  }

  /*       UPDATE ARTICLE       */
  onClickArticleUpdateInput(i: number, j: number) {
    this.ArticleUpdateIndex = i.toString().concat(j.toString());
    this.uniteSelected = false;
    setTimeout(() => {
      this.formName.forEach(name => {
        this.form.controls[name.concat(this.ArticleUpdateIndex)].enable();
      });
    }, 10);
  }

  onClickOutsideArticleUpdateInput(i: number, j: number) {
    let index = i.toString().concat(j.toString());
    if (
      this.ArticleUpdateIndex === index &&
      (this.form.dirty || this.uniteSelected)
    ) {
      this.ArticleUpdateIndex = "";
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
  /*              */
  onDelete() {
    if (this.catToDeleteId !== -1) {
      this.listeArticleService.OnDeleteCategorie(this.catToDeleteId);
      this.onHideAlert();
    } else if (this.ArticleToDeleteId !== -1) {
      this.listeArticleService.OnDeleteArticle(this.ArticleToDeleteId);
      this.onHideAlert();
    } else if (this.uniteToAdd != "") {
      this.form.controls["unite".concat(this.ArtAddIndex)].setValue(
        this.uniteToAdd.toUpperCase()
      );
      this.ficheMaterielService.onAddUnite(this.uniteToAdd.toUpperCase());
      this.onHideAlert();

      this.uniteToAdd = "";
    } else if (this.uniteTodelete !== "") {
      this.ficheMaterielService.onDeleteUnite(this.uniteTodelete);
      this.onHideAlert();
    } else this.onHideAlert();
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "article",
        showAlert: false,
        msg: ""
      })
    );
    this.ArticleToDeleteId = -1;
    this.catToDeleteId = -1;
    this.uniteToAdd = "";
  }
}
