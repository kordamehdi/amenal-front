import { FicheService } from "./../../fiche.service";
import { FicheActiviteService } from "./../fiche-activite.service";
import { FicheModel } from "src/app/projet/models/fiche.model";
import {
  EntreeDesignationNonAssoModel,
  activiteDesignationModel,
  entreeDesignationCommandModel,
  sousLotDesignationModel,
  lotAssoModel,
  sousLotAssoModel,
  entreeDesignationModel
} from "./../../../models/fiche-activite.model";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { NgForm, ControlContainer } from "@angular/forms";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Quote } from "@angular/compiler";
import { refresh } from "../../header/head.selector";
import { validerFiche } from "../../nav/nav.selector";
@Component({
  selector: "app-fiche-activite-designation",
  templateUrl: "./fiche-activite-designation.component.html",
  styleUrls: ["./fiche-activite-designation.component.scss"]
})
export class FicheActiviteDesignationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  showSousLot = [];
  showDetailsSousLot = [[]];
  max = 0;
  listEntree: EntreeDesignationNonAssoModel[] = [];
  entreeToDeleteId = -1;
  lotToDeleteId = -1;

  listEntree$: EntreeDesignationNonAssoModel[] = [];
  listEntree$$: EntreeDesignationNonAssoModel[] = [];
  SousLotListSelected = false;
  EntreeListSelected = false;
  LotListSelected = false;

  listLot = [];
  listLot$ = [];
  selectedSousLot = "";
  selectedLot = -1;
  designation: activiteDesignationModel[];
  AddEntreeIndex = "";
  errorMsg;
  entreeIndex = "";
  showAlert = false;
  ficheActivite: FicheModel;
  sousLotwithEntree: sousLotDesignationModel[];
  isUpdate = -1;
  lotIndex = -1;
  x = true;
  lotWithSousLot: lotAssoModel[] = [
    {
      id: 1,
      lot: "aa",
      sousLots: [
        {
          id: 1,
          designation: "azazaz",
          unite: "H"
        }
      ]
    }
  ];
  sousLotToSelect: sousLotAssoModel[] = [];
  i = "";
  sousLotToDelete = -1;
  constructor(
    private store: Store<App.AppState>,
    private ficheActiviteService: FicheActiviteService,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.ficheActiviteService.OnlistSousLotParProjet();
    this.ficheActiviteService.OnlistLotParProjet();
    this.ficheActiviteService.OnListEntreeDesignationNoAsso();
    this.store
      .select("ficheActivite")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.lotWithSousLot = state.souLotWithLotAssoToProjet;
        this.listLot$ = state.lotAssoToProjet;
        this.sousLotwithEntree = state.entreeDesignationNonAssoBySousLot;
      });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "ficheActivite" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }
        this.ficheActivite = state.ficheSelectionner;
        this.designation = this.ficheActivite.designations;
        let dd = new Array(this.designation.length);
        this.designation.forEach((v, i) => {
          if (this.showDetailsSousLot[i] == null) dd[i] = [false];
          else dd[i] = this.showDetailsSousLot[i];
        });
        this.showDetailsSousLot = dd;
      });
    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "ACTIVITE") {
          this.ficheActiviteService.OnlistSousLotParProjet();
          this.ficheActiviteService.OnlistLotParProjet();
          this.ficheActiviteService.OnListEntreeDesignationNoAsso();
          this.ficheService.onGetFicheByType("ACTIVITE", null);
        }
      });

    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "ACTIVITE" || state === "fiche") {
          this.ficheService.validerFiche(this.ficheActivite.id, "activites");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }

  onShowshowDetail(i) {
    this.showSousLot[i] = !this.showSousLot[i];
  }
  onShowshowDetailOfdetail(i, j) {
    this.showDetailsSousLot[i][j] = !this.showDetailsSousLot[i][j];
  }

  /* UPDATE_LOT_DEBUT */

  onUpdateDesignationBlur(i, listLotUpdt, ds: activiteDesignationModel, ll) {
    setTimeout(() => {
      listLotUpdt.hidden = true;
      if (!this.LotListSelected && ds.lot !== ll) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ficheActivite",
            showAlert: true,
            msg: "Vous devez selectionner le lot depuis la liste!"
          })
        );
        this.form.controls["lot".concat(i)].setValue(ds.lot);
        this.form.controls["lotId".concat(i)].setValue(ds.lotId);
      } else {
        this.LotListSelected = false;
        //UPDATE DESIGNATION
      }
    }, 200);
  }

  onClickDesignation(i, lotUpt) {
    this.selectedLot = i;
    lotUpt.disabled = false;
  }
  onClickOutsideDesignation(i, lotUpt) {
    if (this.selectedLot == i) {
      this.selectedLot = -1;
      lotUpt.disabled = true;
    }
  }
  OnDeleteDesignation(ds) {
    this.lotToDeleteId = ds.id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "ficheActivite",
        showAlert: true,
        msg: "vous etes sure de vouloire supprimé le lot [" + ds.lot + "] ?"
      })
    );
  }

  /* UPDATE_LOT_FIN */

  /* ADD_LOT_DEBUT */
  onSearchLot(value: string) {
    let v = value.trim().toUpperCase();
    if (v !== "") {
      this.listLot = this.listLot$.filter(l => l.lot.includes(v));
    } else {
      this.listLot = this.listLot$;
    }
  }
  OnAddLotFocus(listLotAdd, v) {
    listLotAdd.hidden = false;
    this.listLot = this.listLot$.filter(l =>
      l.lot.includes(v.trim().toUpperCase())
    );

    //this.listLot = this.listLot$;
  }
  onSelectLotAdd(lot) {
    this.LotListSelected = true;
    this.ficheActiviteService.onAddActiviteDesignation(lot.id);
  }
  OnAddLotBlur(listLotAdd, input) {
    setTimeout(() => {
      listLotAdd.hidden = true;
      if (!this.LotListSelected && input.value.trim() !== "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ficheActivite",
            showAlert: true,
            msg: "Vous devez selectionner le lot depuis la liste!"
          })
        );
        input.value = "";
      }
    }, 200);
  }
  /* ADD_LOT_FIN */

  /* ADD_ENTREE_DEBUT */
  onBlurEntreeAdd(entreeListAdd, i, j) {
    setTimeout(() => {
      entreeListAdd.hidden = true;
      let v = this.form.controls["entreeNom".concat(i, "_", j)].value;
      if (!this.EntreeListSelected) {
        this.resetEntreeInput("".concat(i, "_", j));
      }
    }, 200);
  }
  onFocusEntreeAdd(EntreeList, value, slotId, i, j) {
    EntreeList.hidden = false;

    let entreeAsso = this.designation[i].sousLotDesignationPresentations[
      j
    ].entreeDesignationPresentations.map(d => {
      return { id: d.idEntree, type: d.type };
    });

    this.listEntree$ = this.sousLotwithEntree
      .find(l => l.id === slotId)
      .entreeDesignationNonAssoPresentations.filter(e => {
        let send = true;
        entreeAsso.forEach(element => {
          if (e.id === element.id && e.type === element.type) send = false;
        });
        return send;
      });

    this.listEntree = this.listEntree$.filter(l =>
      l.entreeNom.includes(value.trim().toUpperCase())
    );
  }
  onSelectAddEntree(item, i, j) {
    if (item.quantite == 0) {
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "ficheActivite",
          showAlert: true,
          msg: "Cette entree est indisponible!"
        })
      );
      this.resetEntreeInput("".concat(i, "_", j));
    } else {
      this.EntreeListSelected = true;
      this.fillInputSelectEntree("".concat(i, "_", j), item);
      this.max = item.quantite;

      this.form.controls["quantite".concat(i, "_", j)].enable();
    }
  }

  OnSearchEntree(input) {
    let value = input.value.trim().toUpperCase();
    if (value !== "") {
      this.listEntree = this.listEntree$.filter(l =>
        l.entreeNom.includes(value)
      );
      this.listEntree.sort((a, b) => {
        return b.quantite - a.quantite;
      });
    } else {
      this.listEntree = this.listEntree$;
    }
  }
  onAddEntreeClickOutside(i, j, slot) {
    if (
      this.AddEntreeIndex === this.transI_J(i, j) &&
      (this.InputEntreeDirty(this.transI_J(i, j)) || this.EntreeListSelected)
    ) {
      this.EntreeListSelected = false;
      let cmd: entreeDesignationCommandModel = {
        entreeId: this.form.value["entreeId".concat(i, "_", j)],
        quantite: this.form.value["quantite".concat(i, "_", j)],
        type: this.form.value["type".concat(i, "_", j)]
      };
      this.AddEntreeIndex = "";
      let qt = this.form.value["quantite".concat(i, "_", j)];

      if (
        this.form.controls["entreeId".concat(i, "_", j)].valid &&
        this.form.controls["quantite".concat(i, "_", j)].valid
      ) {
        if (qt >= this.max) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg:
                "la quantité dois etre inferieur ou egale a " + this.max + " !"
            })
          );
          this.resetEntreeInput("".concat(i, "_", j));
        } else
          this.ficheActiviteService.onAddEntreeToSousLotDesignation(
            slot.id,
            cmd
          );
      } else
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ficheActivite",
            showAlert: true,
            msg: "Un des champs son invalide !"
          })
        );
    }
  }
  onAddEntreeClick(i, j) {
    this.AddEntreeIndex = this.transI_J(i, j);
  }

  /* ADD_ENTREE_FIN */

  /*UPDATE ENTREE DEBUT*/
  onUpdateEntreeClickOutside(i, j, k, entree) {
    let index = "".concat(i, "_", j, "_", k);
    if (
      this.entreeIndex === index &&
      (this.InputEntreeDirty(index) || this.EntreeListSelected)
    ) {
      this.entreeIndex = "";
      this.EntreeListSelected = false;
      if (
        this.form.controls["entreeId".concat(index)].valid &&
        this.form.controls["quantite".concat(index)].valid
      ) {
        let cmd: entreeDesignationCommandModel = {
          entreeId: this.form.value["entreeId".concat(index)],
          quantite: this.form.value["quantite".concat(index)],
          type: this.form.value["type".concat(index)]
        };
        if (cmd.quantite >= this.max) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg:
                "la quantité dois etre inferieur ou egale a " + this.max + " !"
            })
          );
        } else
          this.ficheActiviteService.onUpdateEntreeToSousLotDesignation(
            entree.id,
            cmd
          );
      }

      this.form.controls["quantite".concat(index)].disable();
      this.form.controls["entreeNom".concat(index)].disable();
    }
  }
  onUpdateEntreeClick(entreDs: entreeDesignationModel, sLot, i, j, k) {
    let entreeAsso = this.designation[i].sousLotDesignationPresentations[
      j
    ].entreeDesignationPresentations.map(d => {
      return { id: d.idEntree, type: d.type };
    });
    let qtt = 0;
    this.listEntree$ = this.sousLotwithEntree
      .find(l => l.id === sLot.slotid)
      .entreeDesignationNonAssoPresentations.filter(e => {
        let send = true;
        entreeAsso.forEach(element => {
          if (e.id === element.id && e.type === element.type) {
            qtt = e.quantite;
            send = false;
          }
        });
        return send;
      });

    this.listEntree$.sort((a, b) => {
      return b.quantite - a.quantite;
    });

    this.listEntree = this.listEntree$;

    this.max = entreDs.quantite + qtt;

    this.entreeIndex = "".concat(i, "_", j, "_", k);
    this.i = this.entreeIndex;
    this.form.controls["quantite".concat(this.entreeIndex)].enable();
    this.form.controls["entreeNom".concat(this.entreeIndex)].enable();
  }
  onFocusEntreeUpdate(EntreeList) {
    this.EntreeListSelected = false;
    EntreeList.hidden = false;
  }
  onBlurEntreeUpdate(entreeListUpdate, entree) {
    setTimeout(() => {
      entreeListUpdate.hidden = true;

      if (!this.EntreeListSelected) {
        this.fillInputSelectEntree(this.i, entree);
      } else this.EntreeListSelected = false;
    }, 200);
  }
  onSelectUpdateEntree(item, i, j, k) {
    if (item.quantite == 0) {
      this.store.dispatch(
        new fromFicheAction.ShowFicheAlert({
          type: "ficheActivite",
          showAlert: true,
          msg: "Cette entree est indisponible"
        })
      );
      this.resetEntreeInput("".concat(i, "_", j, "_", k));
    } else {
      this.EntreeListSelected = true;
      this.fillInputSelectEntree("".concat(i, "_", j, "_", k), item);
      this.form.controls["quantite".concat(i, "_", j, "_", k)].enable();

      let q = this.form.value["quantite".concat(i, "_", j, "_", k)];
      if (item.quantite < q) {
        this.form.controls["quantite".concat(i, "_", j, "_", k)].reset();
      }
    }
  }

  OnDeleteEntree(id, entreeNom) {
    this.entreeToDeleteId = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "ficheActivite",
        showAlert: true,
        msg:
          "vous etes sure de vouloire supprimé l' entree [" + entreeNom + "] ?"
      })
    );
  }

  /* UPDATE ENTREE FIN*/

  /* ADD SOUS LOT DEBUT */
  onSelectAddSousLot(item, i) {
    this.fillInputSelectSousLot(i, item);
    this.SousLotListSelected = true;
  }
  onFocusSousLotAdd(sousLotAdd) {
    sousLotAdd.hidden = false;
  }
  onBlurSousLotAdd(sousLotAdd, i) {
    setTimeout(() => {
      sousLotAdd.hidden = true;
      if (!this.SousLotListSelected) {
        this.resetSousLotInput(i);
        this.SousLotListSelected = false;
      }
    }, 200);
  }

  onAddSousLotClick(lot, i) {
    this.isUpdate = 0;
    this.lotIndex = i;
    let selectedLot = this.lotWithSousLot.find(s => s.lot === lot);
    if (selectedLot == null) this.sousLotToSelect = [];
    else this.sousLotToSelect = selectedLot.sousLots;
  }
  onAddSousLotClickOutside(i, sid) {
    if (this.isUpdate == 0 && this.lotIndex === i && this.form.dirty) {
      this.lotIndex = -1;
      this.isUpdate = -1;
      let id = this.form.value["slotId".concat(i)];
      let qt = this.form.value["slotQuantite".concat(i)];
      let av = this.form.value["avancement".concat(i)];
      if (id == "" || qt == "") {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ficheActivite",
            showAlert: true,
            msg: "le champs [ SOUS LOT ] et [QUANTITE] sont obligatoire!"
          })
        );
      } else if (av !== "" && (0 >= av || av >= 100)) {
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "ficheActivite",
            showAlert: true,
            msg: "l'avancement est un pourcentage (entre 0 et 100)!"
          })
        );
      } else {
        let ds = {
          sousLotId: id,
          quantite: qt,
          avancement: av == "" ? 0 : av
        };
        this.ficheActiviteService.onAddSousLotDesignation(sid, ds);
      }
    }
  }

  /* ADD SOUS LOT FIN */

  /* UPDATE SOUS LOT DEBUT */

  onSelectUpdateSousLot(item, i, j) {
    this.fillInputSelectSousLot(this.transI_J(i, j), item);
    this.SousLotListSelected = true;
  }
  onFocusSousLotUpdate(sousLotAdd) {
    sousLotAdd.hidden = false;
  }
  onBlurSousLotUpdate(sousLotAdd, sLotDs, i, j) {
    setTimeout(() => {
      sousLotAdd.hidden = true;
      if (!this.SousLotListSelected) {
        this.fillInputSelectSousLotUpdate(this.transI_J(i, j), sLotDs);
        this.SousLotListSelected = false;
      }
    }, 200);
  }

  onClickSousLot(lot, i, j) {
    this.selectedLot = -1;
    this.selectedSousLot = "".concat(i, "_", j);
    this.isUpdate = 1;

    let selectedLot = this.lotWithSousLot.find(s => s.lot === lot);
    if (selectedLot == null) this.sousLotToSelect = [];
    else this.sousLotToSelect = selectedLot.sousLots;

    this.form.controls["slotName".concat(this.selectedSousLot)].enable();
    this.form.controls["slotQuantite".concat(this.selectedSousLot)].enable();
    this.form.controls["avancement".concat(this.selectedSousLot)].enable();
  }
  onClickOutsideSousLot(sLotDs, i, j) {
    let ii = "".concat(i, "_", j);
    if (this.isUpdate == 1 && this.selectedSousLot === ii) {
      this.selectedSousLot = "";
      if (this.InputSousLotUpdateDirty(i, j) || this.SousLotListSelected) {
        this.selectedSousLot = "";
        this.SousLotListSelected = false;
        this.selectedLot = -1;
        this.lotIndex = -1;
        this.isUpdate = -1;
        let id = this.form.value["slotId".concat(this.transI_J(i, j))];
        let qt = this.form.value["slotQuantite".concat(this.transI_J(i, j))];
        let av = this.form.value["avancement".concat(this.transI_J(i, j))];
        if (id == null || qt == null || av == null) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg:
                "le champs [ SOUS LOT ] et [QUANTITE] et [AVANCEMENT] sont obligatoire!"
            })
          );
          this.fillInputSelectSousLotUpdate(this.transI_J(i, j), sLotDs);
          this.form.controls[
            "slotQuantite".concat(this.transI_J(i, j))
          ].setValue(sLotDs.quantite);
          this.form.controls["avancement".concat(this.transI_J(i, j))].setValue(
            sLotDs.avancement
          );
        } else if (av !== "" && (0 >= av || av >= 100)) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "ficheActivite",
              showAlert: true,
              msg: "l'avancement est un pourcentage (entre 0 et 100)!"
            })
          );
          this.fillInputSelectSousLotUpdate(this.transI_J(i, j), sLotDs);
          this.form.controls[
            "slotQuantite".concat(this.transI_J(i, j))
          ].setValue(sLotDs.quantite);
          this.form.controls["avancement".concat(this.transI_J(i, j))].setValue(
            sLotDs.avancement
          );
        } else {
          let ds = {
            sousLotId: id,
            quantite: qt,
            avancement: av
          };
          this.ficheActiviteService.onUpdateSousLotDesignation(sLotDs.id, ds);
        }
      }
      this.form.controls["slotName".concat(ii)].disable();
      this.form.controls["slotQuantite".concat(ii)].disable();
      this.form.controls["avancement".concat(ii)].disable();
    }
  }

  OnDeleteSousLotDesignation(sLot) {
    this.sousLotToDelete = sLot.id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "ficheActivite",
        showAlert: true,
        msg:
          "Vous etes sure de vouloire supprimer le lot [" +
          sLot.designation +
          "]? "
      })
    );
  }

  /* UPDATE SOUS LOT FIN */

  transI_J(i, j) {
    return "".concat(i, "_", j);
  }
  onContinue() {
    if (this.entreeToDeleteId !== -1) {
      this.ficheActiviteService.onDeleteEntreeDesignation(
        this.entreeToDeleteId
      );
    } else if (this.lotToDeleteId !== -1) {
      this.ficheActiviteService.OnDeleteDesignation(this.lotToDeleteId);
    } else if (this.sousLotToDelete !== -1) {
      this.ficheActiviteService.onDeleteSousLotDesignation(
        this.sousLotToDelete
      );
    }
    this.onCancel();
  }

  onCancel() {
    this.entreeToDeleteId = -1;
    this.lotToDeleteId = -1;
    this.sousLotToDelete = -1;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "ficheActivite",
        showAlert: false,
        msg: ""
      })
    );
  }
  resetEntreeInput(index) {
    this.form.controls["entreeId".concat(index)].setValue("");
    this.form.controls["type".concat(index)].setValue("");
    this.form.controls["quantite".concat(index)].setValue("");
    this.form.controls["entreeNom".concat(index)].setValue("");
    this.form.controls["unite".concat(index)].setValue("");
    this.form.controls["quantite".concat(index)].disable();
  }
  InputEntreeDirty(index) {
    if (
      this.form.controls["entreeNom".concat(index)].dirty ||
      this.form.controls["quantite".concat(index)].dirty
    ) {
      return true;
    } else return false;
  }
  fillInputSelectEntree(index: string, item) {
    this.form.controls["entreeNom".concat(index)].setValue(item.entreeNom);
    this.form.controls["unite".concat(index)].setValue(item.unite);
    this.form.controls["entreeId".concat(index)].setValue(item.id);
    this.form.controls["type".concat(index)].setValue(item.type);
  }
  resetSousLotInput(index) {
    this.form.controls["slotName".concat(index)].setValue("");
    this.form.controls["slotUnite".concat(index)].setValue("");
    this.form.controls["slotId".concat(index)].setValue("");
  }
  fillInputSelectSousLot(index: string, item) {
    this.form.controls["slotName".concat(index)].setValue(item.designation);
    this.form.controls["slotUnite".concat(index)].setValue(item.unite);
    this.form.controls["slotId".concat(index)].setValue(item.id);
  }
  fillInputSelectSousLotUpdate(index: string, item) {
    this.form.controls["slotName".concat(index)].setValue(item.designation);
    this.form.controls["slotUnite".concat(index)].setValue(item.unite);
    this.form.controls["slotId".concat(index)].setValue(item.slotid);
  }
  InputSousLotUpdateDirty(i, j) {
    if (
      this.form.controls["slotName".concat(this.transI_J(i, j))].dirty ||
      this.form.controls["slotQuantite".concat(this.transI_J(i, j))].dirty ||
      this.form.controls["avancement".concat(this.transI_J(i, j))].dirty
    ) {
      return true;
    } else return false;
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
