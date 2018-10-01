export enum ShiftDay {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export interface Employee {
  employeeName: string;
  phone: string;
  shift: ShiftDay;
}
