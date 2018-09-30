import angular from "angular";

import listComponent from "./list.component";

export const employeeModule = angular.module("app.components.employee", [
  listComponent,
]).name;

export * from "./employee.service";
