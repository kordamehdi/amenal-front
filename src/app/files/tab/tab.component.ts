import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"]
})
export class TabComponent implements OnInit {
  @Input()
  column: String[];
  constructor() {}

  ngOnInit() {}
}
