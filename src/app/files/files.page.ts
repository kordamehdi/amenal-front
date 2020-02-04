import { Component, OnInit } from "@angular/core";

interface User {
  name: String;
  age: number;
  isBig: Boolean;
}

@Component({
  selector: "app-files",
  templateUrl: "./files.page.html",
  styleUrls: ["./files.page.scss"]
})
export class FilesPage implements OnInit {
  users: User[] = [
    { name: "jkkjkkj", age: 4, isBig: true },
    { name: "qa", age: 6, isBig: false },
    { name: "korda", age: 54, isBig: true },
    { name: "kl", age: 98, isBig: false }
  ];
  column: String[] = ["name", "age", "is_big"];

  constructor() {}

  ngOnInit() {}
}
