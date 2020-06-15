import { Injectable } from "@angular/core";
import * as App from "../../store/app.reducers";

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
  CanActivateChild
} from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

@Injectable()
export class CanShowFicheGuard implements CanActivateChild {
  CanAccess = false;

  constructor(private router: Router, private store: Store<App.AppState>) {
    this.store.select("projet").subscribe(state => {
      if (state.projetSelectionner === null) this.CanAccess = false;
      else this.CanAccess = true;
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    if (!this.CanAccess) {
      this.router.navigate(["/"]);
      return false;
    } else return true;
  }
}
