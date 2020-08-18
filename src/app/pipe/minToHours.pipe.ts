import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "minToHrs" })
export class minToHrsPipe implements PipeTransform {
  transform(v: string, arg: string): string {
    if (arg === "H") {
      if (+v === -1) return "--:--";
      else {
        let value = +v * 60;
        var hours = Math.floor(+v).toString();
        var minutes = (+value % 60).toString();

        if (minutes.length == 1) minutes = "0" + minutes;

        if (hours.length == 1) hours = "0" + hours;

        return hours + ":" + minutes;
      }
    }
    if (arg === "M") {
      if (+v === -1) return "--:--";
      else {
        let value = +v;

        var hours = Math.floor(+value / 60).toString();
        var minutes = (+value % 60).toString();

        if (minutes.length == 1) minutes = "0" + minutes;

        if (hours.length == 1) hours = "0" + hours;

        return hours + ":" + minutes;
      }
    } else return v;
  }
}
