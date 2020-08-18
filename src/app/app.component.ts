import { innerHeight } from "./projet/redux/projet.selector";
import { DataStorageService } from "./projet/service/data-storage.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { LoginService } from "./login/login.service";
import { Store } from "@ngrx/store";
import * as App from "./store/app.reducers";
import * as fromProjetAction from "./projet/redux/projet.actions";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home"
    },
    {
      title: "List",
      url: "/list",
      icon: "list"
    }
  ];

  constructor(
    private loginService: LoginService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private store: Store<App.AppState>,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }
  ngOnInit() {
    this.loginService.getUser();
    // set to landscape
  }
  ngAfterViewInit() {
    this.store.dispatch(
      new fromProjetAction.GetInnerHeight(window.innerHeight)
    );
    this.screenOrientation.onChange().subscribe(() => {
      this.store.dispatch(
        new fromProjetAction.GetInnerHeight(window.innerHeight)
      );
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY
      );
    });
  }
}
