import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { livraisonCategorieModel } from "./../../../models/livraison-designation.model";
import { DestinationService } from "./../destination/destination.service";
import { LivraisonDesignationModel } from "./../../../models/livraison.model";
import { destinationModel } from "./../../../models/destination.model";
import { StockDesignationModel } from "./../../../models/stock-designation.model";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import * as fromFicheAction from "../../redux/fiche.action";
import { NgForm } from "@angular/forms";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { untilDestroyed } from "ngx-take-until-destroy";
@Component({
  selector: "app-livraison-designation-valid",
  templateUrl: "./livraison-designation-valid.component.html",
  styleUrls: ["./livraison-designation-valid.component.scss"]
})
export class LivraisonDesignationValidComponent implements OnInit, OnDestroy {
  stockDispo: StockDesignationModel[];
  stockDispo$: StockDesignationModel[] = [];
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

  errorMsg = "";

  showAlert = false;

  FicheLivraison: FicheModel;

  formNames = ["articleId", "quantite", "destinationId", "observation"];

  constructor(
    private store: Store<App.AppState>,
    private destinationService: DestinationService,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.ficheSelectionner !== null)
          this.FicheLivraison = state.ficheSelectionner;

        this.livraisonDesignation = this.FicheLivraison.categorieLivraisons;
        if (state.type === "livDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
      });

    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "LIVRAISON") {
          this.ficheService.validerFiche(this.FicheLivraison.id, "livraisons");
        }
      });
  }

  onClickOutside(i, j) {
    if (this.designationSelectedId === this.transIJ(i, j))
      this.designationSelectedId = null;
  }
  onClick(i, j) {
    this.designationSelectedId = this.transIJ(i, j);
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
  }

  onHideAlert() {
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
