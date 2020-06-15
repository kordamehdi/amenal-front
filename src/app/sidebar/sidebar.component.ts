import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../store/app.reducers";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  username;
  currentRole;
  isRoot;
  @Output() onClose = new EventEmitter<any>();

  constructor(private store: Store<App.AppState>) {}

  ngOnInit() {
    this.store
      .select("projet")
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        this.currentRole = state.currentUser.currentRole;
        this.isRoot = state.currentUser.isRoot;
        this.username = state.currentUser.username;
      });
  }
  OnHide() {
    this.onClose.emit();
  }

  ngOnDestroy() {
    // To protect you, we'll throw an error if it doesn't exist.
  }
}
