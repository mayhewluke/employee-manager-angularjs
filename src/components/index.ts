import angular from "angular";

import { authModule } from "./auth";
import { employeeModule } from "./employee";

export const componentsModule = angular.module("app.components", [
  authModule,
  employeeModule,
]).name;
