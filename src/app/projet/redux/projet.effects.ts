import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
//rxjs
import { Observable, from, of } from "rxjs";
import { map, switchMap, mergeMap, catchError } from "rxjs/operators";
//ngrx
import { Actions, Effect, ofType } from "@ngrx/effects";
//firebase
import * as fromProjetAction from "./projet.actions";
import { DataStorageService } from "../service/data-storage.service";

@Injectable()
export class ProjetEffects {
  @Effect()
  projetAdd$: Observable<any> = this.actions$.pipe(
    ofType(fromProjetAction.GET_PROJETS),
    switchMap((action: fromProjetAction.GetProjets) => {
      return this.dataStorageService.getProjets().pipe(
        mergeMap(projets => {
          return [
            {
              type: fromProjetAction.SET_PROJETS,
              payload: projets
            },
            {
              type: fromProjetAction.IS_BLACK,
              payload: false
            }
          ];
        }),
        catchError(err => {
          console.log(err);
          return of({
            type: fromProjetAction.IS_BLACK,
            payload: true
          });
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private route: Router,
    private dataStorageService: DataStorageService
  ) {}
}
