import { FicheOuvrierDesignationService } from "./../fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { FicheModel } from "./../../models/fiche.model";
import { Store } from "@ngrx/store";
import { Component, OnInit, HostBinding } from "@angular/core";
import * as App from "../../../store/app.reducers";
import * as fromFicheAction from "../redux/fiche.action";
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  typeSelectionner: String;
  count: number;
  totalCount: number;
  leftIsEnding = false;
  rightIsEnding = false;

  constructor(
    private store: Store<App.AppState>,
    private ficheOuvrierDesignationService: FicheOuvrierDesignationService
  ) {}

  ngOnInit() {
    this.store.select("fiche").subscribe(ficheState => {
      this.typeSelectionner = ficheState.typeSelectionner;
      this.count = ficheState.FicheSelectionnerPosition + 1;
      this.totalCount = ficheState.Fiches.length;
    });
  }

  listerOuvrier() {
    switch (this.typeSelectionner) {
      case "OUVRIER":
        this.store.dispatch(new fromFicheAction.ListerOuvrier(true));

        break;

      default:
        break;
    }
  }
  onNext() {
    if (this.count === this.totalCount) {
      this.rightIsEnding = true;
    } else {
      this.rightIsEnding = false;
      this.store.dispatch(new fromFicheAction.NextFiche());
    }
    this.ficheOuvrierDesignationService.onGetOuvrierByProjet();
  }
  onPrevious() {
    if (this.count === 1) {
      console.log(this.count);
      this.leftIsEnding = true;
    } else {
      this.leftIsEnding = false;

      this.store.dispatch(new fromFicheAction.PreviousFiche());
    }
  }
  onValider() {
    this.store.dispatch(new fromFicheAction.ValiderFiche(true));
  }
}
