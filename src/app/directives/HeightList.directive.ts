import { Platform } from "@ionic/angular";
import { Directive, Renderer2, ElementRef, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as App from "../store/app.reducers";

@Directive({
  selector: "[HeightList]"
})
export class HeightList implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store<App.AppState>,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.renderer.setStyle(
      this.el.nativeElement,
      "height",
      this.platform.height() * 0.5 + "px"
    );
  }
}
