import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../../store/app.reducers";
import * as fromProjetAction from "../redux/projet.actions";
import * as fromFicheAction from "./redux/fiche.action";
import { typeChange } from "./header/head.selector";

@Component({
  selector: "app-fiche",
  templateUrl: "./fiche.component.html",
  styleUrls: ["./fiche.component.scss"]
})
export class FicheComponent implements OnInit {
  type = "";
  showSideBar = false;
  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store.select(typeChange).subscribe(type => {
      this.type = type;
    });
  }

  onHideSideBar() {
    this.showSideBar = false;
  }

  onShowSideBar(ev) {
    console.log(ev);
    this.showSideBar = true;
  }

  onSwipeLeft() {
    this.store.dispatch(new fromFicheAction.NextFiche());
  }
  onSwipeRight() {
    this.store.dispatch(new fromFicheAction.PreviousFiche());
  }
  onSwipeDown(e) {
    console.log("onSwipeDown");

    this.store.dispatch(new fromProjetAction.Refresh(this.type));
  }
}
