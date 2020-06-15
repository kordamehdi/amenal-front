import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { fournisseurArticleModel } from "./../../../models/fournisseur-article.model";
import {
  ReceptionCategorieModel,
  ReceptionDesignationModel
} from "./../../../models/reception-designation.model";
import * as FromFicheAction from "../../redux/fiche.action";
import { DesignationReceptionService } from "./designation-reception.service";
import { ListeArticleService } from "./../liste-article/liste-article.service";
import { categorieModel } from "./../../../models/categorie.model";
import { articleModel } from "src/app/projet/models/article.model";
import { locationDesignationModel } from "./../../../models/location-designation.model";
import { FicheModel } from "./../../../models/fiche.model";
import { Store } from "@ngrx/store";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import { NgForm } from "@angular/forms";
import * as fromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-designation-reception",
  templateUrl: "./designation-reception.component.html",
  styleUrls: ["./designation-reception.component.scss"]
})
export class DesignationReceptionComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  isUpdate = -1;

  deleteDsId = -1;

  articleSelected: Boolean = false;
  fournisseurSelected: Boolean = false;
  showDetails = [];
  FicheReception: FicheModel;
  errorMsg: string;
  showAlert = false;
  fournisseurMaterielMap$ = [];
  founisseurToSelect = [];
  founisseurToSelect$ = [];

  dsSelected = "";

  idDsSeleced;

  ArticleToSelect = [];
  ArticleToSelect$ = [];

  uniteAdd = "";
  fournisseurMaterielMap: fournisseurArticleModel[] = [];

  categories: ReceptionCategorieModel[] = [
    {
      id: 1,
      categorie: "Cimment",
      receptionDesignation: [
        {
          id: 1,

          idArticle: 1,
          idFournisseur: 1,
          designation: "ciment 78sx",
          unite: "H",
          observation: "cccccccc",
          quantite: 5,
          fournisseurNom: "mohammedd",
          idFiche: null
        }
      ]
    }
  ];

  formNames = [
    "idArticle",
    "designation",
    "unite",
    "quantite",
    "fournisseurNom",
    "observation"
  ];

  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService,
    private designationReceptionService: DesignationReceptionService
  ) {}
  ngOnInit() {
    this.designationReceptionService.onGetFornisseurArticleByProjet();
    this.store.select("ficheReception").subscribe(state => {
      this.fournisseurMaterielMap$ = state.fournisseurArticleToSelect;
    });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "recDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.FicheReception = {
          ...state.Fiches[state.FicheSelectionnerPosition]
        };
        if (this.FicheReception.categories !== undefined) {
          this.categories = this.FicheReception.categories;
        } else this.categories = [];
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "RECEPTION") {
          this.designationReceptionService.onGetFornisseurArticleByProjet();
          this.ficheService.onGetFicheByType("RECEPTION", null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "RECEPTION") {
          this.ficheService.validerFiche(this.FicheReception.id, "receptions");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }

  onShowshowDetail(i) {
    this.showDetails[i] = !this.showDetails[i];
  }

  /* ARTICLE_ADD_START */

  onAddDesignation() {
    let ds: ReceptionDesignationModel = {
      id: null,
      idArticle: this.form.value["idArticle"],
      idFournisseur: this.form.value["idFournisseur"],
      observation: this.form.value["observation"],
      quantite: this.form.value["quantite"],
      unite: null,
      designation: null,
      fournisseurNom: null,
      idFiche: null
    };
    this.designationReceptionService.onAddReceptionDesignation(ds);
    this.resetAddInput();
  }

  onClickedAddOutside() {
    if (
      this.isUpdate === 0 &&
      (this.form.dirty || this.fournisseurSelected || this.articleSelected)
    ) {
      this.fournisseurSelected = false;
      this.articleSelected = false;
      this.isUpdate = -1;
      console.log(
        "fff : ",
        this.form.value["idFournisseur"],
        " aaa ",
        this.form.value["idArticle"],
        " qqqq ",
        this.form.value["quantite"]
      );
      if (
        this.form.value["idFournisseur"] === null ||
        this.form.value["idFournisseur"] === "" ||
        this.form.value["idArticle"] === null ||
        this.form.value["idArticle"] === "" ||
        this.form.value["quantite"] === null ||
        this.form.value["quantite"] === ""
      ) {
        this.store.dispatch(
          new FromFicheAction.ShowFicheAlert({
            type: "recDs",
            showAlert: true,
            msg:
              "les champs : fournisseur , article et quantite sont obligatoire!"
          })
        );
      } else {
        this.form.ngSubmit.emit();
      }
    }
  }

  onClickAdd() {
    this.isUpdate = 0;
  }

  onFocusArticleAdd(list) {
    list.hidden = false;
    this.fournisseurMaterielMap = this.fournisseurMaterielMap$.filter(
      (fa: fournisseurArticleModel) => {
        let pass = true;
        this.categories.forEach((c: ReceptionCategorieModel) => {
          if (fa.article.categorie === c.categorie) {
            c.receptionDesignation.forEach(element => {
              console.log(element.designation);

              if (
                element.designation === fa.article.designation &&
                element.fournisseurNom === fa.fournisseurNom
              ) {
                pass = false;
              }
            });
          }
        });
        return pass;
      }
    );

    let tabAr = this.fournisseurMaterielMap.map(f => f.article);
    if (tabAr.length > 0) {
      let c = tabAr[0].designation;
      let i = 0;
      tabAr = tabAr.sort((a, b) => {
        if (a.designation < b.designation) {
          return -1;
        }
        if (a.designation > b.designation) {
          return 1;
        }
        return 0;
      });
      this.ArticleToSelect$ = tabAr.filter((a: articleModel) => {
        if (c === a.designation) {
          i = i + 1;
          if (i > 1) return false;
          else return true;
        } else {
          c = a.designation;
          i = 1;
          return true;
        }
      });
      this.ArticleToSelect = this.ArticleToSelect$;
    }
  }

  onSearchAddArticle(value) {
    if (value.trim() !== "") {
      this.ArticleToSelect = this.ArticleToSelect$.filter(m => {
        return m.designation.toLowerCase().includes(value.toLowerCase());
      });
    } else this.ArticleToSelect = this.ArticleToSelect$;
  }

  OnSelectArticleAdd(i) {
    this.founisseurToSelect$ = this.fournisseurMaterielMap.filter(f => {
      return f.article.id === this.ArticleToSelect[i].id;
    });
    this.founisseurToSelect = [...this.founisseurToSelect$];

    this.articleSelected = true;
    this.form.controls["designation"].setValue(
      this.ArticleToSelect$[i].designation
    );
    this.form.controls["unite"].setValue(this.ArticleToSelect[i].unite);
    this.form.controls["idArticle"].setValue(this.ArticleToSelect[i].id);
  }
  onHoverArticleAdd(i) {
    this.form.controls["designation"].setValue(
      this.ArticleToSelect[i].designation
    );
    this.form.controls["unite"].setValue(this.ArticleToSelect[i].unite);
  }

  onBlurArticleAdd(list) {
    setTimeout(() => {
      if (!this.articleSelected) {
        this.form.controls["designation"].setValue("");
        this.form.controls["unite"].setValue("");
        this.form.controls["idArticle"].setValue("");
      }
      list.hidden = true;
    }, 100);
  }

  /*ARTICLE_ADD_END */

  /*FOURNISSEUR_ADD_START */
  onFocusFournisseurAdd(listFr) {
    listFr.hidden = false;
  }

  OnSelectFournisseur(j) {
    this.fournisseurSelected = true;
    this.form.controls["fournisseur"].setValue(
      this.founisseurToSelect[j].fournisseurNom
    );
    this.form.controls["idFournisseur"].setValue(this.founisseurToSelect[j].id);
  }

  onHoverFournisseur(j) {
    this.form.controls["fournisseur"].setValue(
      this.founisseurToSelect[j].fournisseurNom
    );
    this.form.controls["idFournisseur"].setValue(this.founisseurToSelect[j].id);
  }

  onBlurFournisseurAdd(list) {
    setTimeout(() => {
      if (!this.fournisseurSelected) {
        this.form.controls["fournisseur"].setValue("");
        this.form.controls["idFournisseur"].setValue("");
      }
      list.hidden = true;
    }, 100);
  }
  onSearchAddFourniseur(value) {
    if (value.trim() !== "") {
      this.founisseurToSelect = this.founisseurToSelect$.filter(m => {
        return m.fournisseurNom.toLowerCase().includes(value.toLowerCase());
      });
    } else this.founisseurToSelect = [...this.founisseurToSelect$];
  }
  /*FOURNISSEUR_ADD_END */

  /*UPDATE */
  onClickUpdate(ii: number, j: number) {
    this.dsSelected = ii.toString().concat("_", j.toString());
    //eliminate location and ouvrier
    if (ii >= 2) {
      this.isUpdate = 1;

      this.formNames.forEach((key: any) => {
        this.form.controls[key.concat(this.dsSelected)].enable();
      });

      this.fournisseurMaterielMap = this.fournisseurMaterielMap$.filter(
        (fa: fournisseurArticleModel) => {
          let pass = true;
          this.categories.forEach((c: ReceptionCategorieModel) => {
            if (fa.article.categorie === c.categorie) {
              c.receptionDesignation.forEach(element => {
                if (
                  element.designation === fa.article.designation &&
                  element.fournisseurNom === fa.fournisseurNom
                ) {
                  pass = false;
                }
              });
            }
          });
          return pass;
        }
      );

      let tabAr = this.fournisseurMaterielMap.map(f => f.article);
      if (tabAr.length !== 0) {
        let c = tabAr[0].designation;
        let i = 0;
        tabAr = tabAr.sort((a, b) => {
          if (a.designation < b.designation) {
            return -1;
          }
          if (a.designation > b.designation) {
            return 1;
          }
          return 0;
        });
        this.ArticleToSelect$ = tabAr.filter((a: articleModel) => {
          if (
            a.designation ===
            this.categories[ii].receptionDesignation[j].designation
          )
            return false;
          if (c === a.designation) {
            i = i + 1;
            if (i > 1) return false;
            else return true;
          } else {
            c = a.designation;
            i = 1;
            return true;
          }
        });
        this.ArticleToSelect = this.ArticleToSelect$;
      }
    }
  }

  onclickOutsideUpdate(i, j) {
    if (this.dsSelected === i.toString().concat("_", j.toString())) {
      let index = this.dsSelected;
      if (
        this.isUpdate === 1 &&
        (this.form.dirty || this.fournisseurSelected || this.articleSelected)
      ) {
        this.articleSelected = this.fournisseurSelected = false;
        let submit = true;
        let msg;
        let foursName = this.founisseurToSelect$.map(f => f.fournisseurNom);
        let artsName = this.ArticleToSelect$.map(a => a.designation);
        if (
          !artsName.includes(
            this.form.value["designation".concat(this.transIJ(i, j))]
          ) &&
          this.form.value["designation".concat(this.transIJ(i, j))] !==
            this.categories[i].receptionDesignation[j].designation
        ) {
          submit = false;
          msg =
            "Le champs Article est invalide , veuillez le selectionner depuis la liste!";
        }
        if (
          !foursName.includes(
            this.form.value["fournisseurNom".concat(this.transIJ(i, j))]
          ) &&
          this.form.value["fournisseurNom".concat(this.transIJ(i, j))] !==
            this.categories[i].receptionDesignation[j].fournisseurNom
        ) {
          submit = false;
          msg =
            "Le champs fournisseur est invalide , veuillez le selectionner depuis la liste!";
        } else if (
          this.form.value["quantite".concat(this.transIJ(i, j))] === null
        ) {
          submit = false;
          msg = "Le champs quantite est obligatoire";
          this.form.controls["quantite".concat(this.transIJ(i, j))].setValue(
            this.categories[i].receptionDesignation[j].quantite
          );
        }
        if (submit) {
          this.idDsSeleced = [i, j];
          this.form.ngSubmit.emit();
        } else {
          this.dsSelected = "";
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "recDs",
              showAlert: true,
              msg: msg
            })
          );
          this.formNames.forEach((key: any) => {
            this.form.controls[key.concat(this.dsSelected)].setValue(
              this.categories[i].receptionDesignation[j][key]
            );
          });
          this.isUpdate = -1;
        }
      } else {
        this.isUpdate = -1;
        this.dsSelected = "";
      }

      this.formNames.forEach((key: any) => {
        this.form.controls[key.concat(index)].disable();
      });
    }
  }
  transIJ(i, j) {
    return i.toString().concat("_", j.toString());
  }

  onFocusArticleUpdate(list, value) {
    list.hidden = false;
  }
  onBlurArticleUpdate(list, i, j) {
    setTimeout(() => {
      if (!this.articleSelected) {
        this.form.controls["designation".concat(this.transIJ(i, j))].setValue(
          this.categories[i].receptionDesignation[j].designation
        );
        this.form.controls["unite".concat(this.transIJ(i, j))].setValue(
          this.categories[i].receptionDesignation[j].unite
        );
      }
      list.hidden = true;
    }, 100);
  }

  OnSelectArticleUpdate(k, i, j) {
    this.articleSelected = true;

    this.form.controls["designation".concat(this.transIJ(i, j))].setValue(
      this.ArticleToSelect[k].designation
    );
    this.form.controls["unite".concat(this.transIJ(i, j))].setValue(
      this.ArticleToSelect[k].unite
    );
    this.form.controls["idArticle".concat(this.transIJ(i, j))].setValue(
      this.ArticleToSelect[k].id
    );
    this.form.controls["fournisseurNom".concat(this.transIJ(i, j))].setValue(
      ""
    );
  }

  onUpdateDesignation() {
    let articleId = this.fournisseurMaterielMap$
      .map((f: fournisseurArticleModel) => f.article)
      .filter(
        (a: articleModel) =>
          a.designation ===
          this.form.value["designation".concat(this.dsSelected)]
      )[0].id;

    let ds: ReceptionDesignationModel = {
      id: null,
      idArticle: articleId,

      idFournisseur: this.fournisseurMaterielMap$.find(
        f =>
          f.fournisseurNom ===
          this.form.value["fournisseurNom".concat(this.dsSelected)]
      ).id,
      observation: this.form.value["observation".concat(this.dsSelected)],
      quantite: this.form.value["quantite".concat(this.dsSelected)],
      unite: null,
      designation: null,
      fournisseurNom: null,
      idFiche: null
    };
    this.designationReceptionService.onUpdateReceptionDesignation(
      ds,
      this.categories[this.idDsSeleced[0]].receptionDesignation[
        this.idDsSeleced[1]
      ].id
    );
    this.dsSelected = "";
  }
  /*UPDATE FOURNISEEUR */

  onFocusFournisseurUpdate(listFr, i, j) {
    listFr.hidden = false;

    this.founisseurToSelect$ = this.fournisseurMaterielMap.filter(f => {
      return (
        f.article.designation ===
        this.form.value["designation".concat(this.transIJ(i, j))]
      );
    });
    this.founisseurToSelect = this.founisseurToSelect$;
  }
  OnSelectFournisseurUpdate(i, j, k) {
    this.fournisseurSelected = true;

    this.form.controls["fournisseurNom".concat(this.transIJ(i, j))].setValue(
      this.founisseurToSelect[k].fournisseurNom
    );
    this.form.controls["idFournisseur".concat(this.transIJ(i, j))].setValue(
      this.founisseurToSelect[k].id
    );
  }
  onBlurFournisseurUpdate(list, i, j) {
    setTimeout(() => {
      if (!this.fournisseurSelected) {
        this.form.controls[
          "fournisseurNom".concat(this.transIJ(i, j))
        ].setValue(this.categories[i].receptionDesignation[j].fournisseurNom);
      }
      list.hidden = true;
    }, 100);
  }

  /*UODATE FOURNISEUR END /

  /*       */

  onTrsDoubleToDate(min: number, u) {
    if (u === "H") {
      var hours = Math.floor(min / 60);
      var minutes = (min % 60) / 60;
      return hours + minutes;
    } else return min;
  }

  OnDeleteDs(id) {
    this.deleteDsId = id;

    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "recDs",
        showAlert: true,
        msg: "Est ce que vous etes sure de vouloire suprimer cette designation?"
      })
    );
  }

  onCtnAlert() {
    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "recDs",
        showAlert: false,
        msg: ""
      })
    );

    this.designationReceptionService.onDeleteReceptionDesignation(
      this.deleteDsId
    );

    this.deleteDsId = -1;
  }

  onHideAlert() {
    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "recDs",
        showAlert: false,
        msg: ""
      })
    );
    this.resetAddInput();
  }

  resetAddInput() {
    this.form.controls["unite"].reset();
    this.form.controls["designation"].reset();
    this.form.controls["fournisseur"].reset();
    this.form.controls["idArticle"].reset();
    this.form.controls["idFournisseur"].reset();
    this.form.controls["observation"].reset();
    this.form.controls["quantite"].reset();
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
