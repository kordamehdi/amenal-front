import { Injectable } from "@angular/core";
import * as App from "../../store/app.reducers";
import { JwtHelperService } from "@auth0/angular-jwt";

import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";

@Injectable()
export class IsRootGuard implements CanActivate {
  isRoot;
  constructor(private router: Router, private store: Store<App.AppState>) {
    this.store.select("projet").subscribe(state => {
      this.isRoot = state.currentUser.isRoot;
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.isRoot) {
      return true;
    } else return false;
  }
}
