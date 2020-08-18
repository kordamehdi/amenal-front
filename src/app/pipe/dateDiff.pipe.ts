import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
@Pipe({ name: "diffFromNow" })
export class dateDiffPipe implements PipeTransform {
  transform(value: string, arg: string): any {
    let ValueDate = moment(value, "YYYY-MM-DD");

    if (arg === "age") {
      let age = moment().diff(ValueDate, "years");
      return age;
    }

    var years = moment().diff(ValueDate, "year");
    ValueDate.add(years, "years");

    let y;
    if (years.toString().length == 1) y = "0" + years.toString();
    else y = years.toString();

    var months = moment().diff(ValueDate, "months");
    ValueDate.add(months, "months");
    let m;
    if (months.toString().length == 1) m = "0" + months.toString();
    else m = months.toString();

    var days = moment().diff(ValueDate, "days");
    let d;
    if (days.toString().length == 1) d = "0" + days.toString();
    else d = days.toString();

    if (y === "00") {
      if (m === "00") {
        let rs = d + "J";
        if (rs[0] === "0") rs = rs.slice(1, rs.length);
        return rs;
      } else {
        let rs = m + "M " + d + "J";
        if (rs[0] === "0") rs = rs.slice(1, rs.length);
        return rs;
      }
    }

    let rs = y + "A " + m + "M " + d + "J";
    if (rs[0] === "0") rs = rs.slice(1, rs.length);

    return rs;
  }
}
