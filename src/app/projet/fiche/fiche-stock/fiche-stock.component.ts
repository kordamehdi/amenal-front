import { Component, OnInit } from "@angular/core";
import { stockModel } from "../../models/stock-designation.model";
import * as App from "../../../store/app.reducers";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-fiche-stock",
  templateUrl: "./fiche-stock.component.html",
  styleUrls: ["./fiche-stock.component.scss"]
})
export class FicheStockComponent implements OnInit {
  dsSelected = "";
  stocks: stockModel[] = [];
  FicheReception;

  showDetails = [];

  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("fiche").subscribe(state => {
      this.FicheReception = {
        ...state.Fiches[state.FicheSelectionnerPosition]
      };
      this.stocks = this.FicheReception.stockDesignations;
    });
  }

  onFocus(i: number, j: number) {
    this.dsSelected = i.toString().concat("_", j.toString());
  }
  onClickedOutside(i: number, j: number) {
    if (this.dsSelected === this.transIJ(i, j)) {
      this.dsSelected = "";
    }
  }
  transIJ(i: number, j: number) {
    return i.toString().concat("_", j.toString());
  }

  onShowshowDetail(i) {
    this.showDetails[i] = !this.showDetails[i];
  }
}
