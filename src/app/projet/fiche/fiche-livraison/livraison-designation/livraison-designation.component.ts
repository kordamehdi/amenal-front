import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { livraisonCategorieModel } from "./../../../models/livraison-designation.model";
import { LivraisonDesignationModel } from "./../../../models/livraison-designation.model";
import { DestinationService } from "./../destination/destination.service";
import { LivraisonDesignationService } from "./livraison-designation.service";
import { destinationModel } from "./../../../models/destination.model";
import { StockDesignationModel } from "./../../../models/stock-designation.model";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as FromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-livraison-designation",
  templateUrl: "./livraison-designation.component.html",
  styleUrls: ["./livraison-designation.component.scss"]
})
export class LivraisonDesignationComponent implements OnInit, OnDestroy {
  stockDispo: StockDesignationModel[];
  stockDispo$: StockDesignationModel[] = [];
  stockDispo$$: StockDesignationModel[] = [];

  max = 0;
  destinations: destinationModel[] = [];
  destinations$: destinationModel[] = [];

  @ViewChild("f", { static: false })
  form: NgForm;
  isUpdate = -1;
  isFilter = false;
  livraisonDesignationCat: livraisonCategorieModel[] = [];
  livraisonDesignationCat$: livraisonCategorieModel[] = [];

  livraisonDesignations: LivraisonDesignationModel[] = [];
  livraisonDesignations$: LivraisonDesignationModel[] = [];

  articleSelected = false;
  showDetails = [];

  destSelected = false;

  designationSelectedIndex = "";
  i = -1;
  designationSelectedId = -1;
  designationToDeleteId = -1;

  errorMsg = "";

  showAlert = false;
  sortState = [];
  FicheLivraison: FicheModel;
  quantiteList;
  formFilter = ["designation", "destinationNom"];
  formNames = ["articleId", "quantite", "destinationId", "observation"];

  constructor(
    private store: Store<App.AppState>,
    private livraisonDesignationService: LivraisonDesignationService,
    private destinationService: DestinationService,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.destinationService.onGetDestinationsAssoToProjet();
    this.livraisonDesignationService.onGetstockArticle();
    this.store.select("ficheLivraison").subscribe(state => {
      this.stockDispo$$ = state.stockArticles;
      this.destinations$ = state.destinationAsso;
      this.stockDispo = [...this.stockDispo$$];
      this.stockDispo$ = [...this.stockDispo$$];
      this.destinations = [...this.destinations$];
    });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.ficheSelectionner !== null)
          this.FicheLivraison = state.ficheSelectionner;

        this.sortState = [
          {
            name: "designation",
            asc: true,
            isFocus: false
          },
          {
            name: "destinationNom",
            asc: true,
            isFocus: false
          }
        ];

        this.livraisonDesignationCat$ = this.FicheLivraison.categorieLivraisons;
        if (state.type === "livDs" || state.type === "fiche") {
          console.log(state.errorMsg, "    ", state.showAlert);
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.livraisonDesignationCat = this.livraisonDesignationCat$;
        this.livraisonDesignationCat$.forEach(c => {
          if (this.showDetails.find(s => s.catId === c.id) === undefined) {
            let s = { catId: c.id, show: false };
            this.showDetails.push({ ...s });
          }
        });
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "LIVRAISON") {
          this.isFilter = false;
          this.destinationService.onGetDestinationsAssoToProjet();
          this.livraisonDesignationService.onGetstockArticle();
          this.ficheService.onGetFicheByType("LIVRAISON", null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "LIVRAISON") {
          this.ficheService.validerFiche(this.FicheLivraison.id, "livraisons");
          this.store.dispatch(new FromFicheAction.ValiderFiche(""));
        }
      });
  }

  /********* INPUTS_ADD *******/

  /***** INPUTS_ARTICLE ****/
  onSelectArticleAdd(item: StockDesignationModel) {
    this.articleSelected = true;

    this.form.controls["designation"].setValue(item.designation);
    this.form.controls["articleId"].setValue(item.articleId);
    this.form.controls["unite"].setValue(item.unite);
    this.max = item.quantite;
  }

  onFocusArtInputSearch(artAddList) {
    artAddList.hidden = false;
  }
  onBlurArtInputSearch(artAddList) {
    setTimeout(() => {
      artAddList.hidden = true;

      let name = "designation";
      if (
        !this.articleSelected &&
        this.form.controls[name].value.trim() != ""
      ) {
        this.form.controls[name].setValue("");
        this.store.dispatch(
          new FromFicheAction.ShowFicheAlert({
            type: "livDs",
            showAlert: true,
            msg: "La designation doit etre selectionner depuis la liste!"
          })
        );
      }
    }, 100);
  }

  OnSearchArticle(artSrchInput) {
    this.destSelected = false;
    let name = "articleId";
    if (this.isUpdate === 1) name = name.concat(this.i.toString());
    this.form.controls[name].setValue("");

    if (artSrchInput.value.trim() == "")
      this.stockDispo = [...this.stockDispo$];
    else {
      this.stockDispo = this.stockDispo$.filter(s => {
        return s.designation.includes(artSrchInput.value.trim());
      });
    }
  }
  /******* INPUTS_ARTICLE_END *******/
  /***** INPUTS_DESTINATION ****/
  onSelectDstAdd(item: destinationModel) {
    this.destSelected = true;
    this.form.controls["destination"].setValue(item.destination);
    this.form.controls["destinationId"].setValue(item.id);
  }

  onFocusDestInputSearch(dstAddList) {
    dstAddList.hidden = false;
  }
  onBlurDestInputSearch(dstAddList) {
    setTimeout(() => {
      dstAddList.hidden = true;

      let name = "destination";

      if (!this.destSelected && this.form.controls[name].value.trim() != "") {
        this.form.controls[name].setValue("");
        this.store.dispatch(
          new FromFicheAction.ShowFicheAlert({
            type: "livDs",
            showAlert: true,
            msg: "La destination doit etre selectionner depuis la liste!"
          })
        );
      }
    }, 100);
  }

  OnSearchDest(dstSrchInput) {
    this.destSelected = false;
    let name = "destinationId";
    if (this.isUpdate === 1) name = name.concat(this.i.toString());
    this.form.controls[name].setValue("");
    if (dstSrchInput.value.trim() == "")
      this.destinations = [...this.destinations$];
    else {
      this.destinations = this.destinations$.filter(s => {
        return s.destination.includes(dstSrchInput.value.trim().toUpperCase());
      });
    }
  }
  onAddClickOutside() {
    if (this.isUpdate === 0) {
      let submit = true;
      if (this.form.dirty || this.articleSelected || this.destSelected) {
        this.articleSelected = false;
        this.destSelected = false;
        let msg = "Un des champs est invalid!";
        if (this.form.controls["quantite"].value > this.max) {
          msg = "la quantité doit etre inferieur ou egale a " + this.max;
          this.form.controls["quantite"].setValue(this.max);
          submit = false;
        }
        this.formNames.forEach((key: any) => {
          if (this.form.controls[key].invalid) {
            submit = false;
          }
        });
        if (submit) {
          this.form.ngSubmit.emit();
          console.log("submit");
        } else {
          this.isUpdate = -1;
          this.store.dispatch(
            new FromFicheAction.ShowFicheAlert({
              type: "livDs",
              showAlert: true,
              msg: msg
            })
          );
        }
      }
    }
  }
  onAddClick() {
    this.isUpdate = 0;
  }
  /******* INPUTS_DESTINATION_END *******/

  /******* INPUT_ADD_END ********/

  /******* INPUT_UPDATE ********/

  onUpdateClickOutside(idCat, idDs) {
    if (this.designationSelectedIndex === this.transIJ(idCat, idDs)) {
      if (this.isUpdate === 1) {
        let submit = true;
        console.log(
          "*************** ",
          this.updateIsDirty(idCat, idDs),
          this.articleSelected,
          " v ",
          this.destSelected
        );
        if (
          this.updateIsDirty(idCat, idDs) ||
          this.articleSelected ||
          this.destSelected
        ) {
          this.articleSelected = false;
          this.destSelected = false;
          let msg = "Un des champs est invalid!";
          if (
            this.form.controls["quantite".concat(this.designationSelectedIndex)]
              .value > this.max
          ) {
            msg = "la quantité doit etre inferieur ou egale a " + this.max;
            submit = false;
            this.form.controls[
              "quantite".concat(this.designationSelectedIndex)
            ].setValue(
              this.livraisonDesignationCat
                .find(c => c.id === idCat)
                .livraisonDesignationPresentations.find(c => c.id === idDs)
                .quantite
            );
          }

          if (submit) {
            this.form.ngSubmit.emit();
            this.articleSelected = false;
            this.destSelected = false;
          } else {
            this.articleSelected = false;
            this.destSelected = false;
            this.designationSelectedIndex = "";
            this.isUpdate = -1;
            this.store.dispatch(
              new FromFicheAction.ShowFicheAlert({
                type: "livDs",
                showAlert: true,
                msg: msg
              })
            );
          }
        }
      }
      this.designationSelectedIndex = "";

      let names = [
        "articleId",
        "destinationId",
        "designation",
        "quantite",
        "destination",
        "observation"
      ];

      names.forEach((key: string) => {
        this.form.controls[key.concat(this.transIJ(idCat, idDs))].disable();
      });
    }
  }
  onUpdateClick(idCat, idDs) {
    if (this.isFilter) {
      this.showDetails.forEach(c => {
        c.show = false;
      });
      this.onShowshowDetail(idCat);
    }
    this.designationSelectedIndex = this.transIJ(idCat, idDs);
    this.designationSelectedId = idDs;
    this.i = this.transIJ(idCat, idDs);
    this.isUpdate = 1;
    let lv = this.livraisonDesignationCat
      .find(c => c.id === idCat)
      .livraisonDesignationPresentations.find(c => c.id === idDs);
    let names = [
      "articleId",
      "destinationId",
      "designation",
      "quantite",
      "destination",
      "observation"
    ];
    this.stockDispo$ = this.stockDispo$$.filter(
      s => s.articleId !== lv.articleId
    );
    this.stockDispo = this.stockDispo$;
    this.max = 0;
    if (this.stockDispo$$.find(s => s.articleId === lv.articleId) != null)
      this.max = this.stockDispo$$.find(
        s => s.articleId === lv.articleId
      ).quantite;
    this.max = this.max + lv.quantite;
    names.forEach((key: string) => {
      this.form.controls[key.concat(this.transIJ(idCat, idDs))].enable();
    });
  }

  onSelectArticleUpdate(item, idCat, idDs) {
    if (
      item.designation !=
      this.livraisonDesignationCat
        .find(c => c.id === idCat)
        .livraisonDesignationPresentations.find(c => c.id === idDs).designation
    ) {
      this.articleSelected = true;

      this.form.controls[
        "designation".concat(this.transIJ(idCat, idDs))
      ].setValue(item.designation);
      this.form.controls[
        "articleId".concat(this.transIJ(idCat, idDs))
      ].setValue(item.articleId);
      this.form.controls["unite".concat(this.transIJ(idCat, idDs))].setValue(
        item.unite
      );

      if (
        this.form.value["quantite".concat(this.transIJ(idCat, idDs))] >
        item.quantite
      )
        this.form.controls[
          "quantite".concat(this.transIJ(idCat, idDs))
        ].setValue(item.quantite);
    }
  }

  onFocusArtInputUpdateSearch(artAddList) {
    artAddList.hidden = false;
  }
  onBlurArtInputUpdateSearch(artAddList, idCat, idDs) {
    setTimeout(() => {
      artAddList.hidden = true;
      let name = "designation".concat(this.transIJ(idCat, idDs));
      if (
        !this.articleSelected &&
        this.form.controls[name].value.trim() !=
          this.livraisonDesignationCat
            .find(c => c.id === idCat)
            .livraisonDesignationPresentations.find(c => c.id === idDs)
            .designation
      ) {
        this.form.controls[name].setValue(
          this.livraisonDesignationCat
            .find(c => c.id === idCat)
            .livraisonDesignationPresentations.find(c => c.id === idDs)
            .designation
        );
        this.store.dispatch(
          new FromFicheAction.ShowFicheAlert({
            type: "livDs",
            showAlert: true,
            msg: "La designation doit etre selectionner depuis la liste!"
          })
        );
      }
    }, 100);
  }

  onFocusDestInputUpdateSearch(dstUpdateList) {
    dstUpdateList.hidden = false;
  }
  onBlurDestInputUpdateSearch(dstUpdateList, idCat, idDs) {
    setTimeout(() => {
      dstUpdateList.hidden = true;

      let name = "destination".concat(this.transIJ(idCat, idDs));

      if (
        !this.destSelected &&
        this.form.controls[name].value.trim() !=
          this.livraisonDesignationCat
            .find(c => c.id === idCat)
            .livraisonDesignationPresentations.find(c => c.id === idDs)
            .destinationNom
      ) {
        this.form.controls[name].setValue(
          this.livraisonDesignationCat
            .find(c => c.id === idCat)
            .livraisonDesignationPresentations.find(c => c.id === idDs)
            .destinationNom
        );
        this.store.dispatch(
          new FromFicheAction.ShowFicheAlert({
            type: "livDs",
            showAlert: true,
            msg: "La destination doit etre selectionner depuis la liste!"
          })
        );
      }
    }, 100);
  }
  onSelectDstUpdate(idCat, idDs, item: destinationModel) {
    if (
      item.destination !=
      this.livraisonDesignationCat
        .find(c => c.id === idCat)
        .livraisonDesignationPresentations.find(c => c.id === idDs)
        .destinationNom
    ) {
      this.destSelected = true;
      this.form.controls[
        "destination".concat(this.transIJ(idCat, idDs))
      ].setValue(item.destination);
      this.form.controls[
        "destinationId".concat(this.transIJ(idCat, idDs))
      ].setValue(item.id);
    }
  }

  /******* INPUT_UPDATE_END ********/
  OnUpdateLivraisonDesignation() {
    this.isUpdate = -1;
    let ds = {
      idMateriel: this.form.controls[
        "articleId".concat(this.designationSelectedIndex)
      ].value,
      destinationId: this.form.controls[
        "destinationId".concat(this.designationSelectedIndex)
      ].value,
      quantite: this.form.controls[
        "quantite".concat(this.designationSelectedIndex)
      ].value,
      observation: this.form.controls[
        "observation".concat(this.designationSelectedIndex)
      ].value,
      designation: null,
      destinationNom: null,
      unite: null,
      idFiche: null
    };
    this.designationSelectedIndex = "";

    this.livraisonDesignationService.onUpdateLivraisonDesignation(
      ds,
      this.designationSelectedId
    );
  }
  OnAddLivraisonDesignation() {
    this.isUpdate = -1;
    let ds = {
      idMateriel: this.form.controls["articleId"].value,
      destinationId: this.form.controls["destinationId"].value,
      quantite: this.form.controls["quantite"].value,
      observation: this.form.controls["observation"].value,
      designation: null,
      destinationNom: null,
      unite: null,
      idFiche: null
    };
    this.livraisonDesignationService.onAddLivraisonDesignation(ds);
    this.form.reset();
  }

  deleteLivraisonDesignation(idCat, idDs) {
    let ds = this.livraisonDesignationCat
      .find(c => c.id === idCat)
      .livraisonDesignationPresentations.find(c => c.id === idDs);
    let art = ds.designation;

    let dst = ds.destinationNom;

    this.designationToDeleteId = idDs;

    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "livDs",
        showAlert: true,
        msg:
          "Est ce que vous etes sure de supprimer la livraison de  [" +
          art +
          "] vers [" +
          dst +
          "] ?"
      })
    );
  }

  getShowdetail(i) {
    return this.showDetails.find(c => c.catId === i).show;
  }
  onShowshowDetail(i) {
    this.showDetails.find(c => c.catId === i).show = !this.showDetails.find(
      c => c.catId === i
    ).show;
  }

  transIJ(idCat, idDs) {
    return idCat.toString().concat("_", idDs.toString());
  }

  onCtnAlert() {
    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "livDs",
        showAlert: false,
        msg: ""
      })
    );
    if (this.designationToDeleteId !== -1) {
      this.livraisonDesignationService.onDeleteLivraisonDesignation(
        this.designationToDeleteId
      );
    }
    this.designationToDeleteId = -1;
  }

  onHideAlert() {
    this.designationToDeleteId = -1;

    this.store.dispatch(
      new FromFicheAction.ShowFicheAlert({
        type: "livDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  onFilterByArticle(keyWord: string) {
    let word = keyWord.toUpperCase();
    this.livraisonDesignationCat = this.livraisonDesignationCat.filter(f => {
      let isMateriel = false;
      f.livraisonDesignationPresentations.forEach(m => {
        if (m.designation.includes(word)) isMateriel = true;
      });
      if (isMateriel) return true;
      else return false;
    });
    this.livraisonDesignationCat.forEach(
      f =>
        (f.livraisonDesignationPresentations = f.livraisonDesignationPresentations.filter(
          m => m.designation.includes(word)
        ))
    );
  }

  onFilterByCategorie(keyWord: string) {
    let word = keyWord.toUpperCase();
    this.livraisonDesignationCat = this.livraisonDesignationCat.filter(c =>
      c.categorie.includes(word)
    );
  }

  onFilterByDestination(keyWord: string) {
    let word = keyWord.toUpperCase().trim();
    this.livraisonDesignationCat = this.livraisonDesignationCat.filter(f => {
      let isMateriel = false;
      f.livraisonDesignationPresentations.forEach(m => {
        if (m.destinationNom.includes(word)) isMateriel = true;
      });
      if (isMateriel) return true;
      else return false;
    });
    this.livraisonDesignationCat.forEach(
      f =>
        (f.livraisonDesignationPresentations = f.livraisonDesignationPresentations.filter(
          m => m.destinationNom.includes(word)
        ))
    );
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
      this.livraisonDesignationCat = this.slice(this.livraisonDesignationCat$);
      this.livraisonDesignations = this.livraisonDesignationCat$
        .map(c => {
          return c.livraisonDesignationPresentations;
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
      this.livraisonDesignations = this.livraisonDesignations.sort((a, b) => {
        if (a[type] > b[type]) {
          return -1;
        }
        if (a[type] < b[type]) {
          return 1;
        }
        return 0;
      });
    if (!s)
      this.livraisonDesignations = this.livraisonDesignations.sort((a, b) => {
        if (a[type] < b[type]) {
          return -1;
        }
        if (b[type] < a[type]) {
          return 1;
        }
        return 0;
      });
  }

  filter() {
    this.isFilter = true;
    this.livraisonDesignationCat = this.slice(this.livraisonDesignationCat$);
    this.livraisonDesignations = this.livraisonDesignationCat$
      .map(c => {
        return c.livraisonDesignationPresentations;
      })
      .reduce((r, e) => (r.push(...e), r), []);

    this.formFilter.forEach(n => {
      let v = "";
      if (this.form.value[n + "$"] !== null)
        v = this.form.value[n + "$"].trim().toUpperCase();
      if (v != "") {
        this.isFilter = true;
        this.livraisonDesignations = this.livraisonDesignations.filter(r => {
          let o = r[n] === null ? "" : r[n];
          return o.includes(v);
        });
      }
    });
  }
  filterBox(vv: string, type) {
    this.livraisonDesignationCat = this.slice(this.livraisonDesignationCat$);
    let v = vv.trim().toUpperCase();

    if (type == "A") this.onFilterByArticle(v);
    else this.onFilterByCategorie(v);
  }

  slice(c: livraisonCategorieModel[]) {
    let cat: livraisonCategorieModel[] = [...c].map(m =>
      JSON.parse(JSON.stringify(m))
    );
    c.forEach((f, i) => {
      let cList = [...f.livraisonDesignationPresentations].map(cc =>
        JSON.parse(JSON.stringify(cc))
      );
      cat[i].livraisonDesignationPresentations = [...cList];
    });
    return cat;
  }
  updateIsDirty(idCat, idDs) {
    return (
      this.form.controls["quantite".concat(idCat, "_", idDs)].dirty ||
      this.form.controls["observation".concat(idCat, "_", idDs)].dirty
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
