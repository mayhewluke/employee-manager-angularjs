import angular from "angular";

import employeeComponent from "./employee.component";
import { employeeServiceModule } from "./employee.service";
import formComponent from "./form.component";
import listComponent from "./list.component";

export const employeeModule = angular.module("app.components.employee", [
  employeeComponent,
  employeeServiceModule,
  formComponent,
  listComponent,
]).name;

export * from "./employee.service";
