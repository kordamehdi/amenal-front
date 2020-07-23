import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpRequest, HttpParams } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as App from "../store/app.reducers";
import * as fromFicheAction from "../projet/fiche/redux/fiche.action";
import * as fromProjetAction from "../projet/redux/projet.actions";
import { Router } from "@angular/router";
import { AuthModel } from "../projet/models/auth.model";
@Injectable()
export class LoginService {
  SERVER_ADDRESS = "http://localhost:8080";
  ouvrierRemovingId: number;
  jwtHelper = new JwtHelperService();

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
  }
  login(username, password) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));

    this.httpClient
      .post<any>(
        this.SERVER_ADDRESS + "/login",
        { username: username, password: password },
        {
          observe: "response",
          responseType: "json"
        }
      )
      .subscribe(
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));

          let token = resp.headers.get("authorization");
          localStorage.setItem("token", token);
          this.getUser();
          this.router.navigate(["/fiche"]);
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromProjetAction.loginError({
              isErr: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  getUser() {
    const jwt = localStorage.getItem("token");
    if (jwt !== null) {
      let currentUser: AuthModel = {
        username: this.jwtHelper.decodeToken(jwt).sub,
        isRoot: this.jwtHelper.decodeToken(jwt).isRoot,
        currentRole: !this.jwtHelper.decodeToken(jwt).isRoot
          ? this.jwtHelper.decodeToken(jwt).roles[0].authority
          : "ROOT",
        roles: this.jwtHelper.decodeToken(jwt).roles
      };
      this.store.dispatch(new fromProjetAction.setCurrentUser(currentUser));
    }
  }
  logout() {
    localStorage.removeItem("token");
    this.store.dispatch(new fromFicheAction.Reset());
    this.store.dispatch(new fromProjetAction.AddProjet(null));
    this.store.dispatch(new fromProjetAction.setCurrentUser(null));
    this.router.navigate(["/login"]);
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }
}
