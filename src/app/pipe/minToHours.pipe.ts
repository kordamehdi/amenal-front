import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "minToHrs" })
export class minToHrsPipe implements PipeTransform {
  transform(value: string, arg: string): string {
    if (arg === "H") {
      var hours = Math.floor(+value / 60);
      var minutes = +value % 60;
      console.log(hours + "H " + minutes + "MIN");
      return hours + "H " + minutes + "MIN";
    } else return value;
  }
}
