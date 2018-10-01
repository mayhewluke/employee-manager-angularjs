import { UrlService } from "@uirouter/angularjs";
import angular, { ILocationProvider } from "angular";

import { commonModule } from "common";
import { componentsModule } from "components";

import err404Component from "./err404.component";
import initComponent from "./init.component";
import rootComponent from "./root.component";

// TODO find a way to get TypeScript to ensure this path actually exists
import "./root.css";

export const rootModule = angular
  .module("app", [
    componentsModule,
    commonModule,
    err404Component,
    rootComponent,
    initComponent,
  ])
  .config(
    /* @ngInject */
    ($locationProvider: ILocationProvider, $urlServiceProvider: UrlService) => {
      $locationProvider.html5Mode(true);
      // If route doesn't exist, show 404 without changing the URL
      $urlServiceProvider.rules.otherwise({
        options: { location: false },
        state: "404",
      });
    },
  ).name;
