import {
  default as uiRouterModule,
  StateProvider,
  StateService,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";
import firebase from "firebase/app";
import "firebase/auth";

const config: IComponentOptions = {
  controller: class InitComponentController {
    private unsubscribe = (): void => undefined;

    /* @ngInject */
    public constructor(private $state: StateService) {}

    public $onInit() {
      this.unsubscribe = firebase
        .auth()
        .onAuthStateChanged(user =>
          this.$state.go(user === null ? "login" : "employees"),
        );
    }
    public $onDestroy() {
      this.unsubscribe();
    }
  },
  template: `
    <p class="loading">Loading...</p>
  `,
};

const name = angular
  .module("initComponent", [uiRouterModule])
  .component("init", config)
  .config(
    /* @ngInject */
    ($stateProvider: StateProvider) => {
      $stateProvider.state("init", {
        component: "init",
        url: "/",
      });
    },
  ).name;

export default name;
