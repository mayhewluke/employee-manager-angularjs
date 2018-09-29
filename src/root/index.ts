import angular from "angular";

import { commonModule } from "common";
import { componentsModule } from "components";

import rootComponent from "./root.component";

// TODO find a way to get TypeScript to ensure this path actually exists
import "./root.css";

export const rootModule = angular.module("app", [
  componentsModule,
  commonModule,
  rootComponent,
]).name;
