import { DataStorageService } from "./service/data-storage.service";
import { ProjetModel } from "./models/projet.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as App from "../store/app.reducers";

@Component({
  selector: "app-projet",
  templateUrl: "./projet.page.html",
  styleUrls: ["./projet.page.scss"]
})
export class ProjetPage {
  @ViewChild("f", { static: false })
  formData: NgForm;
  showAlert: Boolean;

  constructor(private store: Store<App.AppState>) {}

  OnAddProjet() {
    const value = this.formData.value;
    const projet = { titre: value[""], fichierTypes: value[""] };
  }
}
