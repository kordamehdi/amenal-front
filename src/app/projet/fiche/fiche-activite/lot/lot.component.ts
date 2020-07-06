import { FicheMaterielService } from "./../../fiche-location/materiel/materie.service";
import { LotService } from "./lot.service";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  entreeModel,
  lotModel,
  sousLotModel,
  entreeNonAssoModel
} from "src/app/projet/models/lot.model";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import { NgForm } from "@angular/forms";
import { untilDestroyed } from "ngx-take-until-destroy";
@Component({
  selector: "app-lot",
  templateUrl: "./lot.component.html",
  styleUrls: ["./lot.component.scss"]
})
export class LotComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  showSousLot = [false];
  showDetailsSousLot = [[false]];
  addSlot = false;
  addEntree = false;
  updateEntree = false;
  updateSousLot = false;
  listEntree: entreeNonAssoModel[] = [];
  listEntree$: entreeNonAssoModel[] = [];
  listEntree$$: entreeNonAssoModel[] = [];
  i = -1;
  j = -1;
  selectedLot = -1;
  selectedSousLot = "";
  index = "";
  lots: lotModel[];
  errorMsg;
  showAlert;
  entreeSelected = false;
  lotToDeleteID = -1;
  sousLotToDeleteID = -1;
  entreeToDeleteID = -1;
  uniteToAdd = "";
  AssoLoToProjet = true;
  AssoSousLoToProjet = true;

  unites = [];
  constructor(
    private store: Store<App.AppState>,
    private lotService: LotService,
    private ficheMaterielService: FicheMaterielService
  ) {}

  ngOnInit() {
    this.lotService.onListLot();
    this.lotService.onListEntreeNonAsso();
    this.lotService.onGetUnite();

    this.store
      .select("ficheActivite")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.unites = state.unites;
        this.lots = state.lots;
        let dd = new Array(this.lots.length);
        this.lots.forEach((v, i) => {
          if (this.showDetailsSousLot[i] == null) dd[i] = [false];
          else dd[i] = this.showDetailsSousLot[i];
        });
        this.showDetailsSousLot = dd;

        this.listEntree$$ = state.entreeNonAsso;
        this.listEntree$ = state.entreeNonAsso;
        this.listEntree = this.listEntree;
      });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "lot" || state.type === "unite") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
      });
  }

  /*AJOUT DES LOTS*/
  OnAddLotBlur(lot) {
    let value = lot.value.trim().toUpperCase();
    if (value !== "") {
      let lotValues = this.lots.map(l => l.designation.toUpperCase());
      if (lotValues.includes(value)) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "lot",
            showAlert: true,
            msg: "Ce lots est deja existant!"
          })
        );
      } else {
        this.lotService.onAddlot(value);
        lot.value = "";
      }
    }
  }
  onUpdateLotBlur(lotUpt, lot: lotModel) {
    let v = lotUpt.value.trim().toUpperCase();
    if (v !== "") {
      if (v !== lot.designation) {
        //
        this.lotService.onUpdateLot(v, lot.id);
      }
    } else {
      lotUpt.value = lot.designation;
    }
  }
  onClickLot(i, input) {
    setTimeout(() => {
      this.AssoLoToProjet = false;
      input.disabled = false;
    }, 200);
    this.selectedLot = i;
  }
  onClickOutsideLot(i, input) {
    if (this.selectedLot === i) {
      this.AssoLoToProjet = true;
      input.disabled = true;

      this.selectedLot = -1;
    }
  }
  OnDeleteLot(sLotId, lot) {
    this.lotToDeleteID = sLotId;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "lot",
        showAlert: true,
        msg: "Vous etes sure de vouloir supprimer le lot [ " + lot + " ] !"
      })
    );
  }

  onAssoLotToProjet(lotId) {
    if (this.AssoLoToProjet) this.lotService.onAssoLotToProjet(lotId);
  }

  /*AJOUT DES LOTS*/

  /* SOUS LOTS DEBUT*/
  onAddSousLotClick() {
    this.addSlot = true;
  }
  onAddSousLotClickOutside(slot, slotUnt, lot: lotModel) {
    if (this.addSlot) {
      this.addSlot = false;
      let slotValue = slot.value.toUpperCase();
      let slotUntValue = slotUnt.value.toUpperCase();
      if (slotValue != "" && slotUntValue != "") {
        let sousLotValues = lot.sousLots.map(s => s.designation);
        if (sousLotValues.includes(slotValue)) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg: "ce sous lot est deja existant pour le lot selectionner!"
            })
          );
          slot.value = "";
          slotUnt.value = "";
        } else if (!this.unites.includes(slotUntValue)) {
          this.uniteToAdd = slotUntValue;

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg:
                "l' unite [" +
                slotUntValue +
                "] est introuvable ,est ce que vous voulais l' ajouter?"
            })
          );
        } else {
          let slot = {
            designation: slotValue,
            unite: slotUntValue,
            lotId: lot.id
          };
          this.lotService.onAddSousLot(slot);
        }
      }
    }
  }
  onUpdateSousLotClick(i, j) {
    setTimeout(() => {
      this.form.controls["slotName".concat(i, "_", j)].enable();
      this.form.controls["slotUnite".concat(i, "_", j)].enable();
      this.AssoSousLoToProjet = false;
    }, 200);
    this.i = i;
    this.j = j;
    this.updateSousLot = true;
  }

  onUpdateSousLotClickOutside(slot: sousLotModel, lot: lotModel, i, j) {
    if (this.updateSousLot && i === this.i && j === this.j) {
      this.updateSousLot = false;
      this.AssoSousLoToProjet = true;

      let slotValue = this.form.value["slotName".concat(i, "_", j)]
        .trim()
        .toUpperCase();
      let slotUntValue = this.form.value["slotUnite".concat(i, "_", j)]
        .trim()
        .toUpperCase();

      this.form.controls["slotName".concat(i, "_", j)].disable();
      this.form.controls["slotUnite".concat(i, "_", j)].disable();

      if (slotValue != "" && slotUntValue != "") {
        if (slotValue !== slot.designation || slotUntValue !== slot.unite) {
          let sousLotValues = lot.sousLots
            .map(s => s.designation)
            .filter(d => d !== slot.designation);
          if (sousLotValues.includes(slotValue)) {
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "lot",
                showAlert: true,
                msg: "ce sous lot est deja existant pour le lot selectionner!"
              })
            );
            this.form.controls["slotUnite".concat(i, "_", j)].setValue(
              slot.unite
            );
            this.form.controls["slotName".concat(i, "_", j)].setValue(
              slot.designation
            );
          } else if (!this.unites.includes(slotUntValue)) {
            this.uniteToAdd = slotUntValue;
            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "lot",
                showAlert: true,
                msg:
                  "l' unite [" +
                  slotUntValue +
                  "] est introuvable ,est ce que vous voulais l' ajouter?"
              })
            );
          } else {
            let sl = {
              designation: slotValue,
              unite: slotUntValue,
              lotId: lot.id
            };
            this.lotService.onUpdateSousLot(sl, slot.id);
          }
        }
      } else {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "lot",
            showAlert: true,
            msg: "le champs sous lots et unité sont obligatoire!"
          })
        );
        this.form.controls["slotUnite".concat(i, "_", j)].setValue(slot.unite);
        this.form.controls["slotName".concat(i, "_", j)].setValue(
          slot.designation
        );
      }
    }
  }
  /*UNITE_UPDATE_DEBUT */
  onFocusUnitUpdate(unitUpdt) {
    unitUpdt.hidden = false;
  }
  onBlurUnitUpdate(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 300);
  }
  onSelectUniteUpdate(i, j, unite) {
    this.form.controls["slotUnite".concat(i, "_", j)].setValue(unite);
  }
  /*UNITE_UPDATE_FIN */

  /*UNITE_ADD_DEBUT */

  onFocusUnitAdd(unitAdd) {
    unitAdd.hidden = false;
  }
  onBlurUnitAdd(list) {
    setTimeout(() => {
      list.hidden = true;
    }, 300);
  }
  onSelectUniteAdd(i, unite) {
    this.form.controls["slotUnite".concat(i)].setValue(unite);
  }
  /*UNITE_ADD_FIN */
  onClickSousLot(i, j) {
    this.selectedLot = -1;
    this.selectedSousLot = "".concat(i, "_", j);
  }
  onClickOutsideSousLot(i, j) {
    if (this.selectedSousLot === "".concat(i, "_", j)) {
      this.selectedSousLot = "";
    }
  }
  OnDeleteSousLot(sLotId, slot) {
    this.sousLotToDeleteID = sLotId;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "lot",
        showAlert: true,
        msg: "Vous etes sure de vouloir supprimer le sous lot " + slot + " !"
      })
    );
  }
  onAssoSousLotToProjet(sLotId) {
    if (this.AssoSousLoToProjet) this.lotService.onAssoSousLotToProjet(sLotId);
  }

  /*SOUS LOT FIN */

  /*INPUT ENTREE DEBUT*/
  onFocusEntreeAdd(list, slot: sousLotModel) {
    let entreeNoms = slot.entrees.map(e => e.entreeNom);
    this.listEntree$ = this.listEntree$$.filter(l => {
      return !entreeNoms.includes(l.entreeNom);
    });
    this.listEntree = this.listEntree$;
    list.hidden = false;
  }
  onBlurEntreeAdd(list, i, j) {
    setTimeout(() => {
      list.hidden = true;
    }, 200);
  }
  onFocusEntreeUpdate(list, slot: sousLotModel) {
    let entreeNoms = slot.entrees.map(e => e.entreeNom);
    this.listEntree$ = this.listEntree$$.filter(l => {
      return !entreeNoms.includes(l.entreeNom);
    });
    this.listEntree = this.listEntree$;

    list.hidden = false;
  }
  onBlurEntreeUpdate(list, item, i, j, k) {
    setTimeout(() => {
      let entreeValue = this.form.value[
        "entreeNom".concat(i, "_", j, "_", k)
      ].trim();

      if (!this.entreeSelected && entreeValue != item.entreeNom) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "lot",
            showAlert: true,
            msg:
              "Le champs Entree et quantite est obligatoire , veuillez le selectionner depuis la liste!"
          })
        );
        this.fillInputUpdate(i.concat("_", j, "_", k), item);
      }
      list.hidden = true;
    }, 200);
  }
  onSelectUpdateEntree(item, i: string, j, k) {
    this.entreeSelected = true;
    this.fillInputSelectEntree("".concat(i, "_", j, "_", k), item);
  }
  OnSearchEntree(value) {
    if (value.trim() !== "") {
      this.listEntree = this.listEntree$.filter(m => {
        return m.entreeNom.toLowerCase().includes(value.toLowerCase());
      });
    } else this.listEntree = this.listEntree$;
  }

  onUpdateEntreeClick(i, j, k) {
    this.index = "".concat(i, "_", j, "_", k);

    this.form.controls["quantiteEstimer".concat(this.index)].enable();
    this.form.controls["entreeNom".concat(this.index)].enable();

    this.updateEntree = true;
  }

  onUpdateEntreeClickOutside(i, j, k, ent: entreeModel) {
    let index = "".concat(i, "_", j, "_", k);
    if (
      this.updateEntree &&
      this.index == index &&
      this.form.controls["entreeNom".concat(this.index)].dirty
    ) {
      setTimeout(() => {
        this.form.controls["entreeNom".concat(this.index)].disable();
        this.form.controls["quantiteEstimer".concat(this.index)].disable();
      }, 101);

      this.updateEntree = false;
      let entreeId = this.form.value["entreeId".concat(index)];
      let quantite = this.form.value["quantiteEstimer".concat(index)];
      let entreeValue = this.form.value["entreeNom".concat(index)].trim();
      let isCor = false;

      this.listEntree$$.forEach(e => {
        if (entreeId === e.id && e.entreeNom === entreeValue) {
          isCor = true;
        }
      });
      if (isCor) {
        if (quantite != "") {
          let type = this.form.value["type".concat(index)];
          let entree = {
            type: type,
            entreeId: entreeId,
            bdg: quantite,
            SousLotId: null
          };

          this.lotService.onUpdateEntree(entree, ent.id);
        } else {
          this.form.controls["entreeNom".concat(index)].setValue(ent.entreeNom);
          this.form.controls["quantiteEstimer".concat(index)].setValue(ent.bdg);
          this.form.controls["unite".concat(index)].setValue(ent.unite);
          this.form.controls["entreeId".concat(index)].setValue(ent.idEntree);
          this.form.controls["type".concat(index)].setValue(ent.type);
        }
      } else {
        if (entreeValue !== "") {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg:
                "Le champs Entree et quantite est obligatoire , veuillez le selectionner depuis la liste!"
            })
          );
        }

        this.form.controls["entreeNom".concat(index)].setValue(ent.entreeNom);
        this.form.controls["quantiteEstimer".concat(index)].setValue(ent.bdg);
        this.form.controls["unite".concat(index)].setValue(ent.unite);
        this.form.controls["entreeId".concat(index)].setValue(ent.idEntree);
        this.form.controls["type".concat(index)].setValue(ent.type);
      }
    }
  }

  onAddEntreeClick(i, j) {
    this.addEntree = true;
    this.i = i;
    this.j = j;
  }

  onAddEntreeClickOutside(i, j, slotId) {
    if (this.addEntree && i === this.i && j === this.j) {
      this.addEntree = false;
      let entreeId = this.form.value["entreeId".concat(i, "_", j)];
      let quantite = this.form.value["quantiteEstimer".concat(i, "_", j)];
      let entreeValue = this.form.value["entreeNom".concat(i, "_", j)].trim();
      let isCor = false;

      this.listEntree$$.forEach(e => {
        if (entreeId === e.id && e.entreeNom === entreeValue) {
          isCor = true;
        }
      });

      if (isCor) {
        if (quantite != "") {
          let type = this.form.value["type".concat(i, "_", j)];
          let entree = {
            type: type,
            entreeId: entreeId,
            quantiteEstimer: quantite
          };
          console.log(entree);
          this.lotService.onAddEntreeToSousLot(entree, slotId);
        }
      } else {
        if (entreeValue !== "") {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "lot",
              showAlert: true,
              msg:
                "Le champs Entree et quantite est obligatoire , veuillez le selectionner depuis la liste!"
            })
          );
        }
        this.resetEntreeInput("".concat(i, "_", j));
      }
    }
  }

  onSelectAddEntree(item: entreeNonAssoModel, i, j) {
    this.entreeSelected = true;
    this.fillInputSelectEntree("".concat(i, "_", j), item);
  }
  OnDeleteEntree(entreeId, entree) {
    this.entreeToDeleteID = entreeId;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "lot",
        showAlert: true,
        msg: "Vous etes sure de vouloir supprimer l' entree " + entree + " !"
      })
    );
  }
  /*INPUT ENTREE FIN */

  onShowshowDetail(i) {
    this.showSousLot[i] = !this.showSousLot[i];
  }
  onShowshowDetailOfdetail(i, j) {
    this.showDetailsSousLot[i][j] = !this.showDetailsSousLot[i][j];
  }

  resetEntreeInput(index) {
    this.form.controls["entreeId".concat(index)].setValue("");
    this.form.controls["type".concat(index)].setValue("");
    this.form.controls["quantiteEstimer".concat(index)].setValue("");
    this.form.controls["entreeNom".concat(index)].setValue("");
    this.form.controls["unite".concat(index)].setValue("");
  }
  fillInputUpdate(index: string, item) {
    this.form.controls["entreeNom".concat(index)].setValue(item.entreeNom);
    this.form.controls["quantiteEstimer".concat(index)].setValue(item.bdg);
    this.form.controls["unite".concat(index)].setValue(item.unite);
    this.form.controls["entreeId".concat(index)].setValue(item.id);
    this.form.controls["type".concat(index)].setValue(item.type);
  }
  fillInputSelectEntree(index: string, item) {
    this.form.controls["entreeNom".concat(index)].setValue(item.entreeNom);
    this.form.controls["unite".concat(index)].setValue(item.unite);
    this.form.controls["entreeId".concat(index)].setValue(item.id);
    this.form.controls["type".concat(index)].setValue(item.type);
  }
  transI_J(i, j) {
    return "".concat(i, "_", j);
  }
  onContinue() {
    console.log(this.sousLotToDeleteID, " ", this.entreeToDeleteID);
    if (this.lotToDeleteID != -1) {
      this.lotService.onDeleteLot(this.lotToDeleteID);
    } else if (this.sousLotToDeleteID != -1) {
      this.lotService.onDeleteSousLot(this.sousLotToDeleteID);
    } else if (this.entreeToDeleteID != -1) {
      this.lotService.onDeleteEntree(this.entreeToDeleteID);
    } else if (this.uniteToAdd.length != 0) {
      this.ficheMaterielService.onAddUnite(this.uniteToAdd);
      this.uniteToAdd = "";
      this.lotService.onGetUnite();
    }
    this.onCancel();
  }
  onCancel() {
    this.lotToDeleteID = -1;
    this.sousLotToDeleteID = -1;
    this.entreeToDeleteID = -1;

    if (this.uniteToAdd.length != 0) {
      this.form.controls[
        "slotUnite".concat(this.i.toString(), "_", this.j.toString())
      ].setValue(this.lots[this.i].sousLots[this.j].unite);
      this.uniteToAdd = "";
    }

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "lot",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
