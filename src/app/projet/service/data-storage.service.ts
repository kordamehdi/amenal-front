import { ProjetModel } from "./../models/projet.model";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import "rxjs/Rx";
import { interval } from "rxjs";
import { first } from "rxjs/operators";
import * as App from "../../store/app.reducers";
import { Store } from "@ngrx/store";

@Injectable()
export class DataStorageService {
  SERVER_ADDRESS = "";
  private source = interval(3000);

  constructor(
    private httpClient: HttpClient,
    private store: Store<App.AppState>
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
  }

  getProjets() {
    return this.httpClient.get<ProjetModel>(this.SERVER_ADDRESS + "/projets", {
      observe: "body", //trsponse
      responseType: "json"
    });
  }
  testConnection() {
    this.source.subscribe(() => {
      this.httpClient
        .get<any>(this.SERVER_ADDRESS + "/projets", {
          observe: "body",
          responseType: "json"
        })
        .pipe(first())
        .subscribe(
          resp => {
            if (resp.status === 200) {
              console.log(true);
            } else {
              console.log(false);
            }
          },
          err => console.log(err)
        );
    });
  }
}
