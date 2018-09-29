import angular, { IComponentOptions } from "angular";

import { logIn } from "./auth.service";

const config: IComponentOptions = {
  bindings: {
    email: "<",
    password: "<",
  },
  controller: class LoginFormController {
    public email!: string;
    public password!: string;
    public hasError: boolean = false;

    public submit(email: string, password: string) {
      logIn(email, password)
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

const name = angular.module("loginComponent", []).component("login", config)
  .name;

export default name;
