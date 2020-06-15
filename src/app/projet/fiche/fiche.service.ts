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
  SERVER_ADDRESS = "";
  projetSelectionner: ProjetModel;
  fiches;
  ficheSelectionnerId;
  ficheSelectionner: FicheModel;
  typeSelectionner;
  listAll;
  constructor(
    private store: Store<App.AppState>,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.store
      .select("projet")
      .subscribe(state => (this.SERVER_ADDRESS = state.baseUrl));

    this.store.select("fiche").subscribe(projetState => {
      this.projetSelectionner = projetState.projetSelectionner;
      if (projetState.Fiches.length > 0) {
        this.fiches = projetState.Fiches;
        this.ficheSelectionnerId =
          projetState.Fiches[projetState.FicheSelectionnerPosition].id;
        this.ficheSelectionner =
          projetState.Fiches[projetState.FicheSelectionnerPosition];
      }
      this.listAll = projetState.listAll;
      this.typeSelectionner = projetState.typeSelectionner;
    });
  }

  validerFiche(id, type) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    this.httpClient
      .put<FicheModel[]>(this.SERVER_ADDRESS + "/fiches/" + type + "/" + id, {
        observe: "body",
        responseType: "json"
      })
      .subscribe(
        () => {
          if (this.listAll) this.onGetFicheByType("TOUS", null);
          else this.onGetFicheByType(this.typeSelectionner, null);
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(new fromFicheAction.ValiderFiche(""));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: "fiche valider avec succer!"
            })
          );
        },
        resp => {
          this.store.dispatch(new fromProjetAction.IsBlack(false));
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }

  onGetFicheByType(ficheType: String, route: ActivatedRoute) {
    this.store.dispatch(new fromProjetAction.IsBlack(true));
    let params;
    if (route == null)
      params = new HttpParams().set("date", this.ficheSelectionner.date);
    else params = new HttpParams().set("date", null);

    this.httpClient
      .get<FicheModel[]>(
        this.SERVER_ADDRESS +
          "/projets/" +
          this.projetSelectionner.id +
          "/fiche/" +
          ficheType,
        {
          params: params,
          observe: "body",
          responseType: "json"
        }
      )
      .subscribe(
        fiches => {
          let ficheId = this.ficheSelectionnerId;
          if (route !== null) {
            if (ficheType === "TOUS") {
              this.store.dispatch(new fromFicheAction.setFiches(fiches));
              this.store.dispatch(new fromFicheAction.listAll(true));

              let ps = fiches.findIndex(f => f.id === ficheId);
              if (ps > 0)
                this.store.dispatch(new fromFicheAction.SetFichePosition(ps));

              this.router.navigate(
                [
                  this.typeSelectionner === ""
                    ? fiches[0].type.toLocaleLowerCase()
                    : this.typeSelectionner.toLocaleLowerCase()
                ],
                {
                  relativeTo: route
                }
              );
            } else {
              this.store.dispatch(
                new fromFicheAction.SelectFicheType({
                  fiches: fiches,
                  type: ficheType
                })
              );
              this.store.dispatch(new fromFicheAction.listAll(false));
            }
          } else {
            this.store.dispatch(
              new fromFicheAction.SelectFicheType({
                fiches: fiches,
                type: ficheType
              })
            );
          }
          this.store.dispatch(new fromProjetAction.IsBlack(false));
        },
        resp => {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              showAlert: true,
              type: "fiche",
              msg: resp.error.message
            })
          );
        }
      );
  }
}
