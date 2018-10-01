import {
  default as uiRouterModule,
  StateProvider,
  StateService,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { AuthService } from "./auth.service";

import "./login.component.css";

const config: IComponentOptions = {
  bindings: {
    email: "<",
    password: "<",
  },
  controller: class LoginFormController {
    public email!: string;
    public password!: string;
    public hasError: boolean = false;

    /* @ngInject */
    public constructor(
      private $state: StateService,
      private AuthService: AuthService, // tslint:disable-line:no-shadowed-variable
    ) {}

    public submit(email: string, password: string) {
      this.AuthService.logIn(email, password)
        .then(() => {
          this.hasError = false;
          this.$state.go("employees");
        })
        .catch(() => {
          this.hasError = true;
        });
    }
  },
  // TODO add spinner when request is in progress
  template: require("./login.component.html"),
};

const name = angular
  .module("loginComponent", [uiRouterModule])
  .component("login", config)
  .config(
    /* @ngInject */
    ($stateProvider: StateProvider) => {
      $stateProvider.state("login", {
        component: "login",
        url: "/login",
      });
    },
  ).name;

export default name;
