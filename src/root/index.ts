import angular, { ILocationProvider } from "angular";

import { commonModule } from "common";
import { componentsModule } from "components";

import initComponent from "./init.component";
import rootComponent from "./root.component";

// TODO find a way to get TypeScript to ensure this path actually exists
import "./root.css";

export const rootModule = angular
  .module("app", [componentsModule, commonModule, rootComponent, initComponent])
  .config(($locationProvider: ILocationProvider) => {
    $locationProvider.html5Mode(true);
  }).name;
