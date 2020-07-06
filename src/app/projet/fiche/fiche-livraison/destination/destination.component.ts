import { Component, OnInit } from "@angular/core";
import * as App from "../../../../store/app.reducers";
import { Store } from "@ngrx/store";
import { DestinationService } from "./destination.service";
import { destinationModel } from "src/app/projet/models/destination.model";
import * as fromFicheAction from "../../redux/fiche.action";

@Component({
  selector: "app-destination",
  templateUrl: "./destination.component.html",
  styleUrls: ["./destination.component.scss"]
})
export class DestinationComponent implements OnInit {
  culumn = ["DESTINATION"];
  dstIndex = -1;
  destinations: destinationModel[];
  errorMsg;
  showAlert;
  destinationDeleteId = -1;

  constructor(
    private store: Store<App.AppState>,
    private destinationService: DestinationService
  ) {}

  ngOnInit() {
    this.destinationService.onGetDestinations();
    this.store.select("ficheLivraison").subscribe(state => {
      this.destinations = state.destinations;
      this.onSortByEnGras();
    });

    this.store.select("fiche").subscribe(state => {
      if (state.type === "destination") {
        this.errorMsg = state.errorMsg;
        this.showAlert = state.showAlert;
      }
    });
  }

  onUpdateClick(id, dstInput) {
    this.dstIndex = id;

    dstInput.disabled = false;
  }

  onUpdateClickedOutside(id, input) {
    if (this.dstIndex === id) {
      let dsts = this.destinations.map(d => d.destination);
      let old = this.destinations.find(d => d.id === this.dstIndex).destination;
      if (dsts.includes(input.value.trim().toUpperCase())) {
        if (old.trim().toUpperCase() !== input.value.trim().toUpperCase()) {
          this.store.dispatch(
            new fromFicheAction.ShowFicheAlert({
              type: "destination",
              showAlert: true,
              msg: "Cette destination est deja existante!"
            })
          );
          input.value = this.destinations.find(
            d => d.id === this.dstIndex
          ).destination;
        }
      } else
        this.destinationService.UpdateDestination(
          input.value.trim().toUpperCase(),
          id
        );
      this.dstIndex = -1;
      input.disabled = true;
    }
  }

  onAddClickedOutside(dstInput) {
    if (dstInput.value.trim() !== "") {
      let dsts = this.destinations.map(d => d.destination);
      if (dsts.includes(dstInput.value.trim().toUpperCase()))
        this.store.dispatch(
          new fromFicheAction.ShowFicheAlert({
            type: "destination",
            showAlert: false,
            msg: "Cette destination est deja existante!"
          })
        );
      else
        this.destinationService.AddDestination(
          dstInput.value.trim().toUpperCase()
        );
      dstInput.value = "";
    }
  }
  OnAssoDstToProjet(id) {
    this.destinationService.onAssoDstToProjet(id);
  }
  OnDeleteDestination(id, dst) {
    this.destinationDeleteId = id;
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "destination",
        showAlert: true,
        msg: "Vous voulais supprimer la destination :" + dst
      })
    );
  }
  onCtnAlert() {
    if (this.destinationDeleteId !== -1) {
      this.destinationService.DeleteDestination(this.destinationDeleteId);
      this.destinationDeleteId = -1;
    }
    this.onHideAlert();
  }
  onSortByEnGras() {
    // descending order z->a
    if (this.destinations !== null)
      this.destinations = this.destinations.sort((a, b) => {
        if (a.isAsso && b.isAsso) return 0;
        if (a.isAsso) {
          return -1;
        } else if (b.isAsso) {
          return 1;
        } else return 0;
      });
  }
  onHideAlert() {
    this.store.dispatch(
      new fromFicheAction.ShowFicheAlert({
        type: "destination",
        showAlert: false,
        msg: ""
      })
    );
  }
  getFile(event) {
    this.destinationService.onImportExcelFileDestination(event.target.files[0]);
  }
}
