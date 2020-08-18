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
import { articleModel } from "src/app/projet/models/article.model";
import { FicheModel } from "./../../../models/fiche.model";
import { Store } from "@ngrx/store";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import { NgForm } from "@angular/forms";
import * as fromFicheReceptionAction from "../redux/fiche-reception.action";
import { untilDestroyed } from "ngx-take-until-destroy";
import { listRec } from "../redux/fiche-reception.selectors";

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
  sortState;
  articleSelected: Boolean = false;
  fournisseurSelected: Boolean = false;
  showDetails = [
    {
      cat: "",
      show: false
    }
  ];
  FicheReception: FicheModel;
  errorMsg: string;
  showAlert = false;
  fournisseurMaterielMap$ = [];
  founisseurToSelect = [];
  founisseurToSelect$ = [];

  formFilter = ["designation", "brf", "fournisseurNom", "observation"];

  dsSelected = "";
  isFilter = false;
  receptionDs = [];
  idDsSeleced;

  ArticleToSelect = [];
  ArticleToSelect$ = [];

  uniteAdd = "";
  fournisseurMaterielMap: fournisseurArticleModel[] = [];

  categories: ReceptionCategorieModel[] = [];
  categories$: ReceptionCategorieModel[] = [];

  formNames = [
    "idArticle",
    "designation",
    "unite",
    "quantite",
    "brf",
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
      });

    this.store
      .select(listRec)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.fiche !== null) this.FicheReception = state.fiche;
        if (this.FicheReception.categories !== undefined)
          this.categories$ = this.FicheReception.categories;
        else this.categories$ = [];

        this.sortState = [
          {
            name: "designation",
            asc: true,
            isFocus: false
          },
          {
            name: "fournisseurNom",
            asc: true,
            isFocus: false
          },
          {
            name: "brf",
            asc: true,
            isFocus: false
          },
          {
            name: "observation",
            asc: true,
            isFocus: false
          }
        ];

        if (state.ListRecState.showDetails.length === 0) {
          this.categories$.forEach(c => {
            if (
              this.showDetails.find(s => s.cat === c.categorie) === undefined
            ) {
              let s = { cat: c.categorie, show: false };
              this.showDetails.push({ ...s });
            }
          });
        } else {
          this.showDetails = state.ListRecState.showDetails;
        }

        this.filter();
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "RECEPTION") {
          this.isFilter = false;
          this.designationReceptionService.onGetFornisseurArticleByProjet();
          this.ficheService.onGetFicheByType("RECEPTION", null);
          this.form.controls["designation$"].reset();
          this.form.controls["fournisseurNom$"].reset();
          this.form.controls["brf$"].reset();
          this.form.controls["observation$"].reset();
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "RECEPTION") {
          this.ficheService.validerFiche(this.FicheReception.id, "receptions");
          this.store.dispatch(new FromFicheAction.ValiderFiche(""));
        }
      });
  }

  onShowshowDetail(cat) {
    let st = this.showDetails.find(s => s.cat === cat);
    st.show = !st.show;
  }
  onTestShowDetail(cat) {
    let st = this.showDetails.find(s => s.cat === cat);
    return st.show;
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
      brf: this.form.value["brf"],
      designation: null,
      fournisseurNom: null,
      idFiche: null,
      catId: null
    };
    this.designationReceptionService.onAddReceptionDesignation(ds);
    this.resetAddInput();
  }

  onClickedAddOutside() {
    if (
      this.isUpdate === 0 &&
      (this.formAddIsdirty() ||
        this.fournisseurSelected ||
        this.articleSelected)
    ) {
      this.fournisseurSelected = false;
      this.articleSelected = false;
      this.isUpdate = -1;

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
        this.resetAddInput();
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

    if (this.founisseurToSelect.length === 1) {
      let fr = this.founisseurToSelect[0];
      this.form.controls["fournisseur"].setValue(fr.fournisseurNom);
      this.form.controls["idFournisseur"].setValue(fr.id);
    }
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
    if (this.isFilter) {
      this.showDetails.forEach(s => (s.show = false));
      let cc = this.categories$.find(r => r.id == ii).categorie;
      this.showDetails.find(s => s.cat === cc).show = true;
    }
    //eliminate location and ouvrier
    if (ii >= 2 || ii == -1) {
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
            this.categories[ii].receptionDesignation.find(l => l.id === j)
              .designation
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
            this.categories[i].receptionDesignation.find(r => r.id === j)
              .designation
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
            this.categories[i].receptionDesignation.find(r => r.id === j)
              .fournisseurNom
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
            this.categories[i].receptionDesignation.find(r => r.id === j)
              .quantite
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
              this.categories[i].receptionDesignation.find(r => r.id === j)[key]
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
          this.categories[i].receptionDesignation.find(r => r.id === j)
            .designation
        );
        this.form.controls["unite".concat(this.transIJ(i, j))].setValue(
          this.categories[i].receptionDesignation.find(r => r.id === j).unite
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
      brf: this.form.value["brf".concat(this.dsSelected)],
      fournisseurNom: null,
      idFiche: null,
      catId: null
    };
    this.designationReceptionService.onUpdateReceptionDesignation(
      ds,
      this.categories[this.idDsSeleced[0]].receptionDesignation.find(
        r => r.id === this.idDsSeleced[1]
      ).id
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
        ].setValue(
          this.categories[i].receptionDesignation.find(r => r.id === j)
            .fournisseurNom
        );
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
  filter() {
    this.categories = this.slice(this.categories$);
    this.receptionDs = this.categories
      .map(c => {
        let r = c.receptionDesignation;
        let i = this.categories.findIndex(cc => cc == c);
        r.forEach(d => {
          d.catId = i;
        });
        return r;
      })
      .reduce((r, e) => (r.push(...e), r), []);
    if (typeof this.form !== "undefined")
      this.formFilter.forEach(n => {
        let v = "";
        if (this.form.value[n + "$"] !== null)
          v = this.form.value[n + "$"].trim().toUpperCase();
        if (v != "") {
          this.isFilter = true;
          this.receptionDs = this.receptionDs.filter(r => {
            let o = r[n] === null ? "" : r[n];
            return o.includes(v);
          });
        }
      });
  }

  typeIsFocus(type) {
    return this.sortState.find(s => s.name === type).isFocus;
  }
  typeAsc(type) {
    return this.sortState.find(s => s.name === type).asc;
  }

  onSort(type) {
    // descending order z->a

    if (!this.isFilter) {
      this.receptionDs = this.categories
        .map(c => {
          let r = c.receptionDesignation;
          r.forEach(d => {
            d.catId = c.id;
          });
          return r;
        })
        .reduce((r, e) => (r.push(...e), r), []);

      this.isFilter = true;
    }

    let s = this.sortState.find(s => s.name === type).asc;
    s = !s;
    this.sortState.find(s => s.name === type).asc = !this.sortState.find(
      s => s.name === type
    ).asc;
    this.sortState.forEach(e => {
      if (e.name === type) e.isFocus = true;
      else e.isFocus = false;
    });

    if (s)
      this.receptionDs = this.receptionDs.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (a[type] < b[type]) {
          return 1;
        }
        return 0;
      });
    if (!s)
      this.receptionDs = this.receptionDs.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        }
        if (b[type] < a[type]) {
          return 1;
        }
        return 0;
      });
  }

  slice(c: ReceptionCategorieModel[]) {
    let cat: ReceptionCategorieModel[] = [...c].map(m =>
      JSON.parse(JSON.stringify(m))
    );
    c.forEach((f, i) => {
      let cList = [...f.receptionDesignation].map(cc =>
        JSON.parse(JSON.stringify(cc))
      );
      cat[i].receptionDesignation = [...cList];
    });
    return cat;
  }

  resetAddInput() {
    this.form.controls["unite"].reset();
    this.form.controls["designation"].reset();
    this.form.controls["fournisseur"].reset();
    this.form.controls["idArticle"].reset();
    this.form.controls["brf"].reset();
    this.form.controls["idFournisseur"].reset();
    this.form.controls["observation"].reset();
    this.form.controls["quantite"].reset();
  }

  formAddIsdirty() {
    return (
      this.form.controls["fournisseur"].dirty ||
      this.form.controls["designation"].dirty ||
      this.form.controls["brf"].dirty ||
      this.form.controls["quantite"].dirty ||
      this.form.controls["observation"].dirty
    );
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.

    let state = {
      showDetails: this.showDetails,
      sortState: this.sortState
    };

    this.store.dispatch(new fromFicheReceptionAction.ListRecState(state));
  }
}
