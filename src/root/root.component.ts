import angular, { IComponentOptions } from "angular";

const config: IComponentOptions = {
  template: `
  <div class="screen">
    <ui-view></ui-view>
  </div>
  `,
};

const name = angular.module("rootComponent", []).component("root", config).name;

export default name;
