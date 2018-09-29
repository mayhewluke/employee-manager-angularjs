import angular from "angular";

import { authModule } from "./auth";

export const componentsModule = angular.module("app.components", [authModule])
  .name;
