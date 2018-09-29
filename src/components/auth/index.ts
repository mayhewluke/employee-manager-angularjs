import angular from "angular";

import loginComponent from "./login.component";

export const authModule = angular.module("app.components.auth", [
  loginComponent,
]).name;

export * from "./auth.service";
