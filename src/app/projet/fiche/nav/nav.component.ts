import { ProjetModel } from "./../../models/projet.model";
import { FicheModel } from "src/app/projet/models/fiche.model";
import { FicheOuvrierDesignationService } from "./../fiche-ouvrier/fiche-ouvrier-designation/fiche-ouvrier-designation.service";
import { Store } from "@ngrx/store";
import { Component, OnInit, HostBinding, ɵConsole } from "@angular/core";
import * as App from "../../../store/app.reducers";
import * as fromFicheAction from "../redux/fiche.action";
import { nextFiche } from "./nav.selector";
import { typeChange } from "../header/head.selector";
import * as moment from "moment";
import { FicheService } from "../fiche.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  typeSelectionner: string;
  ficheSelectionner: FicheModel;
  projetSelectionner: ProjetModel;
  isValidated;
  count: number = 0;
  totalCount: number = 0;
  leftIsEnding = false;
  rightIsEnding = false;
  listAll = false;
  sepBtwPressAndClick = true;
  constructor(
    private store: Store<App.AppState>,
    private ficheService: FicheService
  ) {}

  ngOnInit() {
    this.store.select(nextFiche).subscribe(state => {
      //this.count = state + 1;
      if (this.count === 1) this.leftIsEnding = true;
      else this.leftIsEnding = false;
    });
    this.store.select(typeChange).subscribe(type => {
      console.log("VALIDER FICHE  = ", type);
      this.typeSelectionner = type;
    });
    this.store.select("fiche").subscribe(ficheState => {
      this.listAll = ficheState.listAll;
      if (ficheState.projetSelectionner != null) {
        this.projetSelectionner = ficheState.projetSelectionner;
      }
      if (ficheState.ficheSelectionner !== null) {
        this.ficheSelectionner = ficheState.ficheSelectionner;
        this.isValidated = ficheState.ficheSelectionner.isValidated;

        let type = ficheState.typeSelectionner;
        let debut = moment(ficheState.projetSelectionner.debut, "YYYY-MM-DD");
        let fin = moment(ficheState.projetSelectionner.fin, "YYYY-MM-DD");
        let current = moment(ficheState.ficheSelectionner.date, "YYYY-MM-DD");
        this.totalCount = fin.diff(debut, "days") + 1;
        this.count = current.diff(debut, "days") + 1;

        if (ficheState.listAll) {
          let pas =
            this.projetSelectionner.fichierTypes.findIndex(t => t === type) + 1;
          this.totalCount = this.totalCount * 10;
          this.count = 10 * (this.count - 1) + pas;
        }

        if (this.count === this.totalCount) this.rightIsEnding = true;
        else this.rightIsEnding = false;

        if (this.count === 1) this.leftIsEnding = true;
        else this.leftIsEnding = false;
      }
    });
  }

  lister() {
    this.store.dispatch(new fromFicheAction.Lister(true));
  }

  onNext() {
    if (this.count !== this.totalCount) {
      if (this.listAll) {
        let lastType = this.projetSelectionner.fichierTypes[
          this.projetSelectionner.fichierTypes.length - 1
        ];
        let firstType = this.projetSelectionner.fichierTypes[0];
        if (this.ficheSelectionner.type === lastType) {
          let date = moment(this.ficheSelectionner.date)
            .add(1, "days")
            .format("YYYY-MM-DD");

          this.ficheService.onGetFicheByTypeAndDate(firstType, date.toString());
        } else {
          let index = this.projetSelectionner.fichierTypes.findIndex(
            t => t === this.ficheSelectionner.type
          );
          let nextType = this.projetSelectionner.fichierTypes[index + 1];

          this.ficheService.onGetFicheByTypeAndDate(
            nextType,
            this.ficheSelectionner.date
          );
        }
      } else {
        let date = moment(this.ficheSelectionner.date)
          .add(1, "days")
          .format("YYYY-MM-DD");

        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          date.toString()
        );
      }
    }
  }

  onPrevious() {
    if (this.count > 1) {
      if (this.listAll) {
        let lastType = this.projetSelectionner.fichierTypes[
          this.projetSelectionner.fichierTypes.length - 1
        ];
        let firstType = this.projetSelectionner.fichierTypes[0];
        if (this.ficheSelectionner.type === firstType) {
          let date = moment(this.ficheSelectionner.date)
            .subtract(1, "days")
            .format("YYYY-MM-DD");

          this.ficheService.onGetFicheByTypeAndDate(lastType, date.toString());
        } else {
          let index = this.projetSelectionner.fichierTypes.findIndex(
            t => t === this.ficheSelectionner.type
          );
          let nextType = this.projetSelectionner.fichierTypes[index - 1];

          this.ficheService.onGetFicheByTypeAndDate(
            nextType,
            this.ficheSelectionner.date
          );
        }
      } else {
        let date = moment(this.ficheSelectionner.date)
          .subtract(1, "days")
          .format("YYYY-MM-DD");

        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          date.toString()
        );
      }
    }
  }
  onLongNext() {
    if (this.count !== this.totalCount) {
      if (this.listAll) {
        if (!this.sepBtwPressAndClick) {
          let lastType = this.projetSelectionner.fichierTypes[
            this.projetSelectionner.fichierTypes.length - 1
          ];

          this.ficheService.onGetFicheByTypeAndDate(
            lastType,
            this.projetSelectionner.fin.toString()
          );
        } else this.sepBtwPressAndClick = false;
      } else {
        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          this.projetSelectionner.fin.toString()
        );
      }
    }
  }
  onLongPrevious() {
    if (this.count > 1) {
      if (this.listAll) {
        if (!this.sepBtwPressAndClick) {
          let firstType = this.projetSelectionner.fichierTypes[0];

          this.ficheService.onGetFicheByTypeAndDate(
            firstType,
            this.projetSelectionner.debut.toString()
          );
        } else this.sepBtwPressAndClick = false;
      } else {
        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          this.projetSelectionner.debut.toString()
        );
      }
    }
  }

  onBegin() {
    if (this.ficheSelectionner.date !== this.projetSelectionner.debut) {
      if (this.listAll) {
        this.sepBtwPressAndClick = true;

        let date = moment(this.ficheSelectionner.date)
          .subtract(1, "days")
          .format("YYYY-MM-DD");

        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          date.toString()
        );
      }
    }
  }

  onEnd() {
    if (this.ficheSelectionner.date !== this.projetSelectionner.fin) {
      if (this.listAll) {
        this.sepBtwPressAndClick = true;
        let date = moment(this.ficheSelectionner.date)
          .add(1, "days")
          .format("YYYY-MM-DD");

        this.ficheService.onGetFicheByTypeAndDate(
          this.ficheSelectionner.type,
          date.toString()
        );
      }
    }
  }

  onValider() {
    if (!this.isValidated)
      this.store.dispatch(
        new fromFicheAction.ValiderFiche(this.typeSelectionner)
      );
  }
}
