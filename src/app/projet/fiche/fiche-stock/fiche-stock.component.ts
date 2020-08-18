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
  stocks$: stockModel[] = [];

  FicheReception;

  showDetails: [
    {
      cat: string;
      show: boolean;
    }
  ] = [
    {
      cat: "",
      show: false
    }
  ];

  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select("fiche").subscribe(state => {
      if (state.ficheSelectionner !== null)
        this.FicheReception = state.ficheSelectionner;

      this.stocks$ = this.FicheReception.stockDesignations;
      this.onSortByStockable();
      this.stocks = this.stocks$;
      console.log("************** ", this.stocks);
      this.stocks.forEach(c => {
        if (this.showDetails.find(s => s.cat === c.categorie) === undefined) {
          let s = { cat: c.categorie, show: false };
          this.showDetails.push({ ...s });
        }
      });
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

  onShowshowDetail(cat) {
    let st = this.showDetails.find(s => s.cat === cat);
    st.show = !st.show;
  }
  onTestShowDetail(cat) {
    let st = this.showDetails.find(s => s.cat === cat);
    return st.show;
  }
  onFocusHeaderInput(input, value) {
    let v = input.value;
    if (v === value) input.value = "";
  }
  onBlurHeaderInput(input, value) {
    let v = input.value.trim();
    if (v === "") input.value = value;
  }
  onFilterByArticle(keyWord: string) {
    let word = keyWord.toUpperCase();
    this.stocks = this.stocks.filter(f => {
      let isMateriel = false;
      f.stockDesignations.forEach(m => {
        if (m.designation.includes(word)) isMateriel = true;
      });
      if (isMateriel) return true;
      else return false;
    });
    this.stocks.forEach(
      f =>
        (f.stockDesignations = f.stockDesignations.filter(m =>
          m.designation.includes(word)
        ))
    );
  }

  onFilterByCategorie(keyWord: string) {
    let word = keyWord.toUpperCase();
    this.stocks = this.stocks.filter(c => c.categorie.includes(word));
  }

  filter(ds: string) {
    this.stocks = this.slice(this.stocks$);
    let ds$ = ds.trim().toUpperCase();
    let reset = true;
    if (ds$ !== "") {
      reset = false;
      this.onFilterByArticle(ds$);
    }

    if (reset) this.stocks = this.slice(this.stocks$);
  }

  filterBox(vv: string, type) {
    this.stocks = this.slice(this.stocks$);
    let v = vv.trim().toUpperCase();

    if (type == "A") this.onFilterByArticle(v);
    else this.onFilterByCategorie(v);
  }

  slice(c: stockModel[]) {
    let cat: stockModel[] = [...c].map(m => JSON.parse(JSON.stringify(m)));
    c.forEach((f, i) => {
      let cList = [...f.stockDesignations].map(cc =>
        JSON.parse(JSON.stringify(cc))
      );
      cat[i].stockDesignations = [...cList];
    });
    return cat;
  }
  onSortByStockable() {
    // descending order z->a
    if (this.stocks$ !== null)
      this.stocks$ = this.stocks$.sort((a, b) => {
        if (a.stockable && b.stockable) return 0;
        if (a.stockable) {
          return 1;
        } else if (b.stockable) {
          return -1;
        } else return 0;
      });
  }
}
