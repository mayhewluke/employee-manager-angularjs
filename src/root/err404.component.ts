import { default as uiRouterModule, StateProvider } from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

const config: IComponentOptions = {
  template: `
    <h1 class="error">Error 404: Not Found</h1>
    <a ui-sref="init">Home</a>
  `,
};

const name = angular
  .module("err404Component", [uiRouterModule])
  .component("err404", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("404", {
      component: "err404",
      url: "/404",
    });
  }).name;

export default name;
