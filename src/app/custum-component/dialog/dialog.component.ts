import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent implements OnInit {
  @Output()
  OnCtn: EventEmitter<any> = new EventEmitter();
  @Output()
  Cancel: EventEmitter<Boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onContinuer() {
    this.OnCtn.emit(null);
  }
  onCaancel() {
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    this.Cancel.emit(true);
  }
}
