import { FicheModel } from "./../models/fiche.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import * as App from "../../store/app.reducers";
import * as fromProjetAction from "../redux/projet.actions";
import * as fromFicheAction from "./redux/fiche.action";

import { ProjetModel } from "../models/projet.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
@Injectable()
export class FicheService {
  SERVER_ADDRESS = "http://localhost:8080";
  projetSelectionner: ProjetModel;

  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.store.select("fiche").subscribe(projetState => {
      this.projetSelectionner = projetState.projetSelectionner;
    });
  }

  validerFiche(id) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<FicheModel[]>(this.SERVER_ADDRESS + "/fiches/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {},
        resp => {
          console.log(resp.error.message);
          this.store.dispatch(
            new fromFicheAction.ShowAlert({
              showAlert: true,
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetFicheByType(ficheType: String, route: ActivatedRoute) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params = new HttpParams().set("date", null);

    this.httpClient
      .get<FicheModel[]>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiche/" +
          ficheType,
        {
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fiches => {
          this.store.dispatch(new fromFicheAction.setFiches(fiches));

          this.store.dispatch(new fromProjetAction.IsBlack(false));
          if (route !== null) {
            this.router.navigate([ficheType.toLocaleLowerCase()], {
              relativeTo: route
            });
          }
        },
        resp => {
          console.log(resp.error.message);
          // this.store.dispatch(
          //   new fromFicheOuvrierAction.ShowAlert({
          //     showAlert: true,
          //     msg: resp.error.message
          //   })
          // );
        }
      );
  }
}
