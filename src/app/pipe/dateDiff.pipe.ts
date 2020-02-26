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

    var months = moment().diff(ValueDate, "months");
    ValueDate.add(months, "months");

    var days = moment().diff(ValueDate, "days");
    return years + "Y " + months + "M " + days + "D";
  }
}
