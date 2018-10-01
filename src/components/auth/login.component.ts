import {
  default as uiRouterModule,
  StateProvider,
  StateService,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { AuthService } from "./auth.service";

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
  // TODO separate out template
  // TODO add spinner when request is in progress
  template: `
  <form ng-submit="$ctrl.submit($ctrl.email, $ctrl.password)">
    <input name="email" type="text" ng-model="$ctrl.email" required>
    <input name="password" type="password" ng-model="$ctrl.password" required>
    <button type="submit">Log in</button>
    <p ng-if="$ctrl.hasError" class="error">Something went wrong!</p>
  </form>
  `,
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
