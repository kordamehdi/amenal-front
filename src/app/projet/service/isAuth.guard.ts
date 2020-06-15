import { Injectable } from "@angular/core";
import * as App from "../../store/app.reducers";

import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<App.AppState>) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let jwt = localStorage.getItem("token");
    if (jwt === null) {
      this.router.navigate(["login"]);
      return false;
    } else return true;
  }
}
