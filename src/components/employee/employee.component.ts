import {
  default as uiRouterModule,
  StateProvider,
  Transition,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { EmployeeService } from "./employee.service";

const config: IComponentOptions = {
  bindings: { transition: "<" },
  controller: class EmployeeController {
    public employee = {};
    private transition!: Transition;

    constructor(
      private EmployeeService: EmployeeService, // tslint:disable-line:no-shadowed-variable
    ) {}

    public $onInit() {
      this.EmployeeService.fetch(this.transition.params().employeeUid).then(
        employee => (this.employee = employee),
      );
    }
  },
  template: `
  <p>Name: {{ $ctrl.employee.employeeName }}</p>
  <p>Phone: {{ $ctrl.employee.phone }}</p>
  <p>Shift: {{ $ctrl.employee.shift }}</p>
  `,
};

const name = angular
  .module("employeeComponent", [uiRouterModule])
  .component("employee", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("employee", {
      bindings: { transition: "$transition$" },
      component: "employee",
      data: {
        requireAuth: true,
      },
      url: "/employee/:employeeUid",
    });
  }).name;

export default name;
