import { FicheOuvrierService } from "./../../projet/fiche/fiche-ouvrier/fiche-ouvrier.service";
import { Store } from "@ngrx/store";
import { Component, OnInit, Input } from "@angular/core";
import * as App from "../../store/app.reducers";
import * as fromFicheAction from "../../projet/fiche/redux/fiche.action";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"]
})
export class TabComponent implements OnInit {
  @Input()
  column: String[];
  @Input()
  showHeader: Boolean = false;
  @Input()
  headerTitle = "title1";
  constructor(
    private store: Store<App.AppState>,
    private ficheOuvrierService: FicheOuvrierService
  ) {}

  ngOnInit() {}

  OnCancel() {
    this.store.dispatch(new fromFicheAction.Lister(false));
  }
}
