import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import * as fromFicheOuvrierAction from "../../projet/fiche/fiche-ouvrier/redux/fiche-ouvrier.action";
import * as fromProjetAction from "../../projet/redux/projet.actions";
import * as App from "../../store/app.reducers";
@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent implements OnInit {
  isBlack = true;

  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("projet").subscribe(state => {
      this.isBlack = state.isBlack;
    });
  }
  onCancel() {
    this.store.dispatch(new fromFicheOuvrierAction.ShowAlert(false));
    this.store.dispatch(new fromProjetAction.IsBlack(false));
  }
}
