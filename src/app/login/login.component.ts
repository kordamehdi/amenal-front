import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoginService } from "./login.service";
import * as App from "../store/app.reducers";
import { Store } from "@ngrx/store";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isErr;
  msg;
  load = false;
  constructor(
    private store: Store<App.AppState>,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.store
      .select("projet")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.load = state.isBlack;
        this.msg = state.loginError.msg;
        this.isErr = state.loginError.isErr;
      });
  }

  login(usr, pswd) {
    this.loginService.login(usr, pswd);
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
