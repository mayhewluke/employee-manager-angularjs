import angular, { IComponentOptions } from "angular";

const config: IComponentOptions = {
  template: `
    <ui-view></ui-view>
  `,
};

const name = angular.module("rootComponent", []).component("root", config).name;

export default name;
