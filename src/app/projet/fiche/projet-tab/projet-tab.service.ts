import { ProjetModel } from "./../../models/projet.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as App from "../../../store/app.reducers";
import * as projetAction from "../../redux/projet.actions";

@Injectable()
export class ProjetService {
  SERVER_ADDRESS = "http://localhost:8080";

  constructor(
    private httpClient: HttpClient,
    private store: Store<App.AppState>,
    private router: Router
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));
  }

  ajouterProjet(projet: ProjetModel) {
    this.store.dispatch(new projetAction.IsBlack(true));

    projet.fichierTypes = [
      "OUVRIER",
      "LOCATION",
      "RECEPTION",
      "LIVRAISON",
      "STOCK",
      "DOCUMENT",
      "ACCIDENT",
      "BESOIN",
      "VISITEUR",
      "ACTIVITE"
    ];
    this.httpClient
      .post<ProjetModel>(this.SERVER_ADDRESS + "/projets", projet, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          this.listerProjet();
          this.store.dispatch(new projetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new projetAction.IsBlack(false));
        }
      );
  }

  listerProjet() {
    this.store.dispatch(new projetAction.IsBlack(true));
    this.httpClient
      .get<ProjetModel[]>(this.SERVER_ADDRESS + "/projets", {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        ps => {
          this.store.dispatch(new projetAction.SetProjets(ps));
          this.store.dispatch(new projetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(new projetAction.IsBlack(false));
        }
      );
  }

  deleteProjet(id) {
    this.httpClient
      .delete<any>(this.SERVER_ADDRESS + "/projets/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        ps => {
          this.listerProjet();
        },
        resp => {
          console.log(resp.error.message);
        }
      );
  }
}
