import { default as uiRouterModule, StateProvider } from "@uirouter/angularjs";
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

    // tslint:disable-next-line:no-shadowed-variable
    public constructor(private AuthService: AuthService) {}

    public submit(email: string, password: string) {
      this.AuthService.logIn(email, password)
        .then(() => {
          this.hasError = false;
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
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("login", {
      component: "login",
      url: "/login",
    });
  }).name;

export default name;
