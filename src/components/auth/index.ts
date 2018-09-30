import {
  HookMatchCriteria,
  TransitionHookFn,
  TransitionService,
} from "@uirouter/angularjs";
import angular from "angular";

import { authServiceModule } from "./auth.service";
import loginComponent from "./login.component";

export const authModule = angular
  .module("app.components.auth", [authServiceModule, loginComponent])
  .config(
    // tslint:disable-next-line:no-shadowed-variable
    ($transitionsProvider: TransitionService) => {
      const requireAuthCriteria: HookMatchCriteria = {
        to: state => {
          try {
            return state!.data!.requireAuth === true;
          } catch {
            return false;
          }
        },
      };
      const requireAuthHook: TransitionHookFn = transition =>
        transition
          .injector()
          .get("AuthService")
          .isAuthenticated()
          ? true
          : transition.router.stateService.target("login");
      $transitionsProvider.onBefore(requireAuthCriteria, requireAuthHook);
    },
  ).name;

export * from "./auth.service";
