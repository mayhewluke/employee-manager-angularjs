import angular, { IComponentOptions } from "angular";

const config: IComponentOptions = {
  template: `
    <h1>Hello world!</h1>
    <ui-view></ui-view>
  `,
};

const name = angular.module("rootComponent", []).component("root", config).name;

export default name;
