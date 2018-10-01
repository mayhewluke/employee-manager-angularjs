import angular from "angular";

import { employeeServiceModule } from "./employee.service";
import listComponent from "./list.component";

export const employeeModule = angular.module("app.components.employee", [
  employeeServiceModule,
  listComponent,
]).name;

export * from "./employee.service";
