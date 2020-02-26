import { Store } from "@ngrx/store";
import { Directive, HostBinding, Input, OnInit } from "@angular/core";
import * as App from "../store/app.reducers";

@Directive({
  selector: "[appHasProjet]"
})
export class HasProjetDirective implements OnInit {
  private projetId;
  @HostBinding("style.font-weight") fontWeight: string;
  @Input("appHasProjet") set hasProjet(projetIds: []) {
    const ps = projetIds.filter(id => {
      return id === this.projetId;
    });
    if (ps.length !== 0) {
      this.fontWeight = "bold";
    } else {
      this.fontWeight = "normal";
    }
  }

  constructor(private store: Store<App.AppState>) {
    this.store.select("fiche").subscribe(projetState => {
      this.projetId = projetState.projetSelectionner.id;
    });
  }

  ngOnInit() {}
}
