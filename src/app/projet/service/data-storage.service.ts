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
@Injectable()
export class DataStorageService {
  SERVER_ADDRESS = "http://localhost:8080";
  private source = interval(3000);

  constructor(private httpClient: HttpClient) {}

  storeRecipes(projet: ProjetModel) {
    /*
 const headers = new HttpHeaders().set('Authorization', 'Bearer afdklasflaldf');
 return this.httpClient.put('https://ng-recipe-book-3adbb.firebaseio.com/recipes.json', this.recipeService.getRecipes(), {
   observe: 'body',
   params: new HttpParams().set('auth', token)
   headers: headers
 });*/

    const req = new HttpRequest(
      "PUT",
      this.SERVER_ADDRESS + "/recipes.json",
      projet,
      { reportProgress: true }
    );
    return this.httpClient.request(req);
  }

  getProjets() {
    // this.httpClient.get<Recipe[]>('https://ng-recipe-book-3adbb.firebaseio.com/recipes.json?auth=' + token)
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
