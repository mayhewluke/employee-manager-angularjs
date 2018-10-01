import angular from "angular";

import createComponent from "./create.component";
import employeeComponent from "./employee.component";
import { employeeServiceModule } from "./employee.service";
import formComponent from "./form.component";
import listComponent from "./list.component";

export const employeeModule = angular.module("app.components.employee", [
  createComponent,
  employeeComponent,
  employeeServiceModule,
  formComponent,
  listComponent,
]).name;

export * from "./employee.service";
