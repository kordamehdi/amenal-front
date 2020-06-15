import { validerFiche } from "./../../nav/nav.selector";
import { DocumentSerive } from "./../document/document.service";
import { FicheService } from "./../../fiche.service";
import { refresh } from "./../../header/head.selector";
import { ShowAlert } from "./../../fiche-ouvrier/redux/fiche-ouvrier.action";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../../../store/app.reducers";
import * as fromFicheAction from "../../redux/fiche.action";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-document-designation",
  templateUrl: "./document-designation.component.html",
  styleUrls: ["./document-designation.component.scss"]
})
export class DocumentDesignationComponent implements OnInit, OnDestroy {
  errorMsg;
  showAlert;
  ficheLocation;
  designation$;
  isValid;
  selectedDs = -1;

  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService,
    private documentSerive: DocumentSerive
  ) {}

  ngOnInit() {
    this.store
      .select("fiche")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.type === "documentDs" || state.type === "fiche") {
          this.errorMsg = state.errorMsg;
          this.showAlert = state.showAlert;
        }

        this.ficheLocation = state.Fiches[state.FicheSelectionnerPosition];
        this.isValid = this.ficheLocation.isValidated;

        this.designation$ = this.ficheLocation.designations;
      });

    this.store
      .select(refresh)
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type.refresh === "DOCUMENT") {
          this.ficheService.onGetFicheByType("DOCUMENT", null);
        }
      });
    this.store
      .select(validerFiche)
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state === "DOCUMENT") {
          this.ficheService.validerFiche(this.ficheLocation.id, "documents");
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
        }
      });
  }

  onClick(i) {
    this.selectedDs = i;
  }
  onClickOutside(id, i, value) {
    if (this.selectedDs === i) {
      this.selectedDs = -1;
      if (this.designation$[i].disponibilite !== value) {
        this.documentSerive.OnUpdtDisponilibte(id);
      }
    }
  }
  onCtnAlert() {
    this.onHideAlert();
  }

  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "documentDs",
        showAlert: false,
        msg: ""
      })
    );
  }
  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
