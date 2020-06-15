import { FicheOuvrierDesignationService } from "./../fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { FicheModel } from "./../../models/fiche.model";
import { Store } from "@ngrx/store";
import { Component, OnInit, HostBinding, ɵConsole } from "@angular/core";
import * as App from "../../../store/app.reducers";
import * as fromFicheAction from "../redux/fiche.action";
import { nextFiche } from "./nav.selector";
import { IfStmt } from "@angular/compiler";
import { typeChange } from "../header/head.selector";
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  typeSelectionner: string;
  isValidated;
  count: number;
  totalCount: number;
  leftIsEnding = false;
  rightIsEnding = false;

  constructor(
    private store: Store<App.AppState>,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService
  ) {}

  ngOnInit() {
    this.store.select(nextFiche).subscribe(state => {
      this.count = state + 1;
      if (this.count === 1) this.leftIsEnding = true;
      else this.leftIsEnding = false;
    });
    this.store.select(typeChange).subscribe(type => {
      console.log("VALIDER FICHE  = ", type);
      this.typeSelectionner = type;
    });
    this.store.select("fiche").subscribe(ficheState => {
      if (ficheState.Fiches.length > 0)
        this.isValidated =
          ficheState.Fiches[ficheState.FicheSelectionnerPosition].isValidated;

      this.totalCount = ficheState.Fiches.length;
      let rt = ficheState.typeSelectionner;

      if (this.count === this.totalCount) this.rightIsEnding = true;
      else this.rightIsEnding = false;
    });
  }

  lister() {
    this.store.dispatch(new fromFicheAction.Lister(true));
  }
  onNext() {
    if (this.count === this.totalCount) {
      this.rightIsEnding = true;
    } else {
      this.rightIsEnding = false;
      this.store.dispatch(new fromFicheAction.NextFiche());
    }
  }
  onPrevious() {
    if (this.count === 1) {
      this.leftIsEnding = true;
    } else {
      this.leftIsEnding = false;

      this.store.dispatch(new fromFicheAction.PreviousFiche());
    }
  }
  onLongNext() {
    if (this.count === this.totalCount) {
      this.rightIsEnding = true;
    } else {
      this.rightIsEnding = false;
      this.store.dispatch(new fromFicheAction.NextDayFiche());
    }
  }
  onLongPrevious() {
    if (this.count === 1) {
      this.leftIsEnding = true;
    } else {
      this.leftIsEnding = false;
      this.store.dispatch(new fromFicheAction.PreviousDayFiche());
    }
  }

  onBegin() {
    if (this.count === 1) {
      this.leftIsEnding = true;
    } else {
      this.leftIsEnding = false;
      this.store.dispatch(new fromFicheAction.SetFichePosition(0));
    }
  }

  onEnd() {
    if (this.count === this.totalCount) {
      this.rightIsEnding = true;
    } else {
      this.rightIsEnding = false;
      this.store.dispatch(
        new fromFicheAction.SetFichePosition(this.totalCount - 1)
      );
    }
  }

  onValider() {
    if (!this.isValidated)
      this.store.dispatch(
        new fromFicheAction.ValiderFiche(this.typeSelectionner)
      );
  }
}
