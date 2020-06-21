import {
  besionModel,
  besoinDesignationModel
} from "./../../../models/besion.model";
import { validerFiche } from "./../../nav/nav.selector";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { FicheBesionService } from "./../fiche-besion.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { Store } from "@ngrx/store";
import { untilDestroyed } from "ngx-take-until-destroy";
import { NgForm } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: "app-fiche-besion-designation",
  templateUrl: "./fiche-besion-designation.component.html",
  styleUrls: ["./fiche-besion-designation.component.scss"]
})
export class FicheBesionDesignationComponent implements OnInit, OnDestroy {
  @ViewChild("f", { static: false })
  form: NgForm;
  selectedDsIndex;
  selectedDsID;
  focusedDsID = -1;

  bsnSelected = false;
  errorMsg;
  ficheBsn;
  showAlert;
  designation$;
  now;
  listBesoin: besionModel[];
  listBesoin$: besionModel[];

  update = -1;
  fromNames = [
    "designation",
    "unite",
    "quantite",
    "retard",
    "satisfaction",
    "observation"
  ];

  constructor(
    private ficheBesionService: FicheBesionService,
    private store: Store<App.AppState>,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.ficheBesionService.listerBesion();
    this.now = moment().format("YYYY-MM-DD");
    this.store
      .select("ficheBesion")
      .pipe(untilDestroyed(this))
      .subscribe(ls => {
        this.listBesoin$ = ls.listBesion;
      });

    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "BsDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        this.ficheBsn = state.ficheSelectionner;

        this.designation$ = this.ficheBsn.designations;
      });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === this.ficheBsn.type) {
          this.ficheService.onGetFicheByType(this.ficheBsn.type, null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === this.ficheBsn.type) {
          this.ficheService.validerFiche(this.ficheBsn.id, "besoins");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }
  OnAddBesoinDesignation() {
    this.now = moment().format("YYYY-MM-DD");

    let bsId = null;
    let bsType = null;
    if (this.bsnSelected) {
      bsId = this.listBesoin$.find(
        b => b.besoin === this.form.controls["designation"].value
      ).id;
      bsType = this.listBesoin$.find(
        b => b.besoin === this.form.controls["designation"].value
      ).type;
    }

    let ds: besoinDesignationModel = {
      BesoinId: bsId,
      BesoinType: bsType,
      designation: this.form.controls["designation"].value,
      unite: this.form.controls["unite"].value,
      dateDemande: this.now,
      datePrevu: this.form.controls["datePrevu"].value,
      observation: this.form.controls["observation"].value,
      quantite: this.form.controls["quantite"].value,
      retard: this.form.controls["retard"].value,
      satisfaction: this.form.controls["satisfaction"].value,
      valid: null,
      idFiche: 0
    };
    this.ficheBesionService.onAddBesionDesignation(ds);
    this.onReset();
    this.update = -1;
  }

  OnUpdateBesoinDesignation() {
    let bsId = null;
    let bsType = null;
    if (this.bsnSelected) {
      bsId = this.listBesoin$.find(
        b =>
          b.besoin ===
          this.form.controls["designation".concat(this.selectedDsIndex)].value
      ).id;
      bsType = this.listBesoin$.find(
        b =>
          b.besoin ===
          this.form.controls["designation".concat(this.selectedDsIndex)].value
      ).type;
    }
    console.log(
      "designation   ",
      this.form.controls["designation".concat(this.selectedDsIndex)].value
    );

    let ds: besoinDesignationModel = {
      BesoinId: bsId,
      BesoinType: bsType,
      designation: this.form.controls[
        "designation".concat(this.selectedDsIndex)
      ].value,
      unite: this.form.controls["unite".concat(this.selectedDsIndex)].value,
      dateDemande: this.form.controls[
        "dateDemande".concat(this.selectedDsIndex)
      ].value,
      datePrevu: this.form.controls["datePrevu".concat(this.selectedDsIndex)]
        .value,
      observation: this.form.controls[
        "observation".concat(this.selectedDsIndex)
      ].value,
      quantite: this.form.controls["quantite".concat(this.selectedDsIndex)]
        .value,
      retard: this.form.controls["retard".concat(this.selectedDsIndex)].value,

      satisfaction: this.form.controls[
        "satisfaction".concat(this.selectedDsIndex)
      ].value,
      valid: null,
      idFiche: 0
    };

    this.ficheBesionService.onUpdateBesionDesignation(ds, this.selectedDsID);

    this.update = -1;
    this.focusedDsID = -1;
    this.selectedDsIndex = -1;
  }

  onAddClick() {
    this.update = 0;
  }

  onAddClickOutside() {
    if (this.update === 0 && this.form.dirty) {
      let submit = true;
      let bsn = this.listBesoin$.map(b => b.besoin);
      ["designation", "unite", "quantite"].forEach(l => {
        if (this.form.controls[l].invalid) {
          submit = false;

          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "BsDs",
              showAlert: true,
              msg: "Le champs " + l + " est invalid!"
            })
          );
        }
      });
      if (submit) {
        if (bsn.includes(this.form.controls["designation"].value)) {
          this.bsnSelected = true;
        } else this.bsnSelected = false;
        console.log("submit");
        this.form.ngSubmit.emit();
      } else this.update = -1;
    }
  }
  ondeleteDesignation(id) {
    this.selectedDsID = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "BsDs",
        showAlert: true,
        msg: "vous etes sure de vouloire suprimé cette designation?"
      })
    );
  }

  onContinue() {
    if (this.selectedDsID !== -1) {
      this.ficheBesionService.onDeleteBesionDesignation(this.selectedDsID);
      this.selectedDsID = -1;
    }
    this.onHideAlert();
  }

  onFocusInputBesoin(list) {
    this.listBesoin = this.listBesoin$;
    list.hidden = false;
  }
  onBlurInputBesoin(bsnList) {
    setTimeout(() => {
      bsnList.hidden = true;
    }, 100);
  }

  onFocusInputUpdateBesoin(list, v) {
    list.hidden = false;
    this.listBesoin = this.listBesoin$.filter(l =>
      l.besoin.includes(v.toUpperCase())
    );
  }
  onSelectBesion(item: besionModel) {
    this.form.controls["designation"].setValue(item.besoin);
    this.form.controls["unite"].setValue(item.unite);
  }

  onUpdateSelectBesion(item: besionModel, i) {
    this.form.controls["designation".concat(i)].setValue(item.besoin);
    this.form.controls["unite".concat(i)].setValue(item.unite);
  }

  onSearchBsn(v: string) {
    if (v.trim() === "") {
      this.listBesoin = this.listBesoin$;
    } else {
      this.listBesoin = this.listBesoin$.filter(l =>
        l.besoin.includes(v.toUpperCase())
      );
    }
  }

  onUpdateClick(i, id) {
    this.update = 1;
    this.selectedDsID = this.focusedDsID = id;
    this.selectedDsIndex = i;
    this.fromNames.forEach(key => {
      this.form.controls[key.concat(i)].enable();
    });
  }
  onUpdateClickOutside(i) {
    if (this.selectedDsIndex === i) {
      console.log("OUTSIDE");
      if (this.update === 1 && this.form.dirty) {
        let submit = true;
        ["designation", "unite", "quantite"].forEach(l => {
          if (this.form.controls[l.concat(i)].invalid) {
            submit = false;

            this.store.dispatch(
              new fromFicheAction.ShowFicheAlert({
                type: "BsDs",
                showAlert: true,
                msg: "Le champs " + l + " est invalid!"
              })
            );
          }
        });
        if (submit) {
          let bsn = this.listBesoin$.map(b => b.besoin);
          if (bsn.includes(this.form.controls["designation".concat(i)].value)) {
            this.bsnSelected = true;
          } else this.bsnSelected = false;
          this.form.ngSubmit.emit();
        } else {
          this.focusedDsID = -1;
          this.selectedDsIndex = -1;
          this.update = -1;
          ["designation", "unite", "quantite"].forEach(l => {
            this.form.controls[l.concat(i)].setValue(this.designation$[i][l]);
          });
        }
      } else {
        this.focusedDsID = -1;
        this.selectedDsIndex = -1;
        this.update = -1;
      }
    }
    this.fromNames.forEach(key => {
      this.form.controls[key.concat(i)].disable();
    });
  }
  onCalculeRetard(value) {
    let dtPrevu = moment(value, "YYYY-MM-DD");
    this.form.controls["retard"].setValue(dtPrevu.diff(moment(), "days"));
  }
  onCalculeRetardUpdate(value, i) {
    let dtPrevu = moment(value, "YYYY-MM-DD");
    this.form.controls["retard".concat(i)].setValue(
      dtPrevu.diff(moment(), "days")
    );
  }
  onHideAlert() {
    this.selectedDsIndex = -1;

    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "BsDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  onReset() {
    [
      "designation",
      "unite",
      "quantite",
      "observation",
      "retard",
      "datePrevu",
      "satisfaction"
    ].forEach(l => {
      this.form.controls[l].reset();
    });
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
