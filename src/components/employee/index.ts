import angular from "angular";

import employeeComponent from "./employee.component";
import { employeeServiceModule } from "./employee.service";
import listComponent from "./list.component";

export const employeeModule = angular.module("app.components.employee", [
  employeeComponent,
  employeeServiceModule,
  listComponent,
]).name;

export * from "./employee.service";
