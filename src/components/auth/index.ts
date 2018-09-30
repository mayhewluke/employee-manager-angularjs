import angular from "angular";

import { authServiceModule } from "./auth.service";
import loginComponent from "./login.component";

export const authModule = angular.module("app.components.auth", [
  authServiceModule,
  loginComponent,
]).name;

export * from "./auth.service";
