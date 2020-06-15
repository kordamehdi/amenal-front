import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { livraisonCategorieModel } from "./../../../models/livraison-designation.model";
import { DestinationService } from "./../destination/destination.service";
import { LivraisonDesignationService } from "./livraison-designation.service";
import { LivraisonDesignationModel } from "./../../../models/livraison.model";
import { destinationModel } from "./../../../models/destination.model";
import { StockDesignationModel } from "./../../../models/stock-designation.model";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as fromFicheAction from "../../redux/fiche.action";
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

  livraisonDesignation: livraisonCategorieModel[] = [];
  articleSelected = false;
  showDetails = [];

  destSelected = false;

  designationSelectedIndex = "";
  i = -1;
  designationSelectedId = -1;
  designationToDeleteId = -1;

  errorMsg = "";

  showAlert = false;

  FicheLivraison: FicheModel;
  quantiteList;

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
        this.FicheLivraison = {
          ...state.Fiches[state.FicheSelectionnerPosition]
        };
        this.livraisonDesignation = this.FicheLivraison.categorieLivraisons;
        if (state.type === "livDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "LIVRAISON") {
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
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
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
          new fromFicheAction.ShowFicheAlert({
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
          new fromFicheAction.ShowFicheAlert({
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
            new fromFicheAction.ShowFicheAlert({
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

  onUpdateClickOutside(i, j) {
    if (this.designationSelectedIndex === this.transIJ(i, j)) {
      if (this.isUpdate === 1) {
        let submit = true;
        if (this.form.dirty || this.articleSelected || this.destSelected) {
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
              this.livraisonDesignation[i].livraisonDesignationPresentations[j]
                .quantite
            );
          }

          if (submit) {
            this.form.ngSubmit.emit();
          } else {
            this.designationSelectedIndex = "";
            this.isUpdate = -1;
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
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
        this.form.controls[key.concat(this.transIJ(i, j))].disable();
      });
    }
  }
  onUpdateClick(i, j, id) {
    this.designationSelectedIndex = this.transIJ(i, j);
    this.i = this.transIJ(i, j);
    this.designationSelectedId = id;
    this.isUpdate = 1;
    let lv = this.livraisonDesignation[i].livraisonDesignationPresentations[j];
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
      this.form.controls[key.concat(this.transIJ(i, j))].enable();
    });
  }

  onSelectArticleUpdate(item, i, j) {
    if (
      item.designation !=
      this.livraisonDesignation[i].livraisonDesignationPresentations[j]
        .designation
    ) {
      this.articleSelected = true;

      this.form.controls["designation".concat(this.transIJ(i, j))].setValue(
        item.designation
      );
      this.form.controls["articleId".concat(this.transIJ(i, j))].setValue(
        item.articleId
      );
      this.form.controls["unite".concat(this.transIJ(i, j))].setValue(
        item.unite
      );

      if (
        this.form.value["quantite".concat(this.transIJ(i, j))] > item.quantite
      )
        this.form.controls["quantite".concat(this.transIJ(i, j))].setValue(
          item.quantite
        );
    }
  }

  onFocusArtInputUpdateSearch(artAddList) {
    artAddList.hidden = false;
  }
  onBlurArtInputUpdateSearch(artAddList, i, j) {
    setTimeout(() => {
      artAddList.hidden = true;
      let name = "designation".concat(this.transIJ(i, j));
      if (
        !this.articleSelected &&
        this.form.controls[name].value.trim() !=
          this.livraisonDesignation[i].livraisonDesignationPresentations[j]
            .designation
      ) {
        this.form.controls[name].setValue(
          this.livraisonDesignation[i].livraisonDesignationPresentations[j]
            .designation
        );
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
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
  onBlurDestInputUpdateSearch(dstUpdateList, i, j) {
    setTimeout(() => {
      dstUpdateList.hidden = true;

      let name = "destination".concat(this.transIJ(i, j));

      if (
        !this.destSelected &&
        this.form.controls[name].value.trim() !=
          this.livraisonDesignation[i].livraisonDesignationPresentations[j]
            .destinationNom
      ) {
        this.form.controls[name].setValue(
          this.livraisonDesignation[i].livraisonDesignationPresentations[j]
            .destinationNom
        );
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "livDs",
            showAlert: true,
            msg: "La destination doit etre selectionner depuis la liste!"
          })
        );
      }
    }, 100);
  }
  onSelectDstUpdate(i, j, item: destinationModel) {
    if (
      item.destination !=
      this.livraisonDesignation[i].livraisonDesignationPresentations[j]
        .destinationNom
    ) {
      this.destSelected = true;
      this.form.controls["destination".concat(this.transIJ(i, j))].setValue(
        item.destination
      );
      this.form.controls["destinationId".concat(this.transIJ(i, j))].setValue(
        item.id
      );
    }
  }

  /******* INPUT_UPDATE_END ********/
  OnUpdateLivraisonDesignation() {
    this.isUpdate = -1;
    let ds: LivraisonDesignationModel = {
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
    let ds: LivraisonDesignationModel = {
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

  deleteLivraisonDesignation(i, j) {
    let art = this.livraisonDesignation[i].livraisonDesignationPresentations[j]
      .designation;
    let dst = this.livraisonDesignation[i].livraisonDesignationPresentations[j]
      .destinationNom;
    this.designationToDeleteId = this.livraisonDesignation[
      i
    ].livraisonDesignationPresentations[j].id;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
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

  onShowshowDetail(i) {
    this.showDetails[i] = !this.showDetails[i];
  }

  transIJ(i, j) {
    return i.toString().concat("_", j.toString());
  }

  onCtnAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
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
      new fromFicheAction.ShowFicheAlert({
        type: "livDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
