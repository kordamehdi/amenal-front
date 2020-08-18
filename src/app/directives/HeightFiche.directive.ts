import { Platform } from "@ionic/angular";
import { dimension } from "./../projet/redux/projet.selector";
import { Directive, Renderer2, ElementRef, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../store/app.reducers";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

@Directive({
  selector: "[HeightFiche]"
})
export class HeightFiche implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store<App.AppState>,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.store.select(dimension).subscribe(state => {
      let screenHeight = state.innerHeight - 73;

      if (state.listeAdmin) screenHeight = this.platform.height() * 0.55;
      else screenHeight = this.platform.height() * 0.85;

      this.renderer.setStyle(
        this.el.nativeElement,
        "max-height",
        screenHeight + "px"
      );
    });
  }
}
