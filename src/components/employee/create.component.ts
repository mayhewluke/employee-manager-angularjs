import {
  default as uiRouterModule,
  StateProvider,
  StateService,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { Employee, ShiftDay } from "common/employeeTypes";

import { EmployeeService } from "./employee.service";

const config: IComponentOptions = {
  controller: class CreateEmployeeController {
    public employee: Employee = {
      employeeName: "",
      phone: "",
      shift: ShiftDay.Monday,
    };
    public hasError: boolean = false;

    constructor(
      // tslint:disable-next-line:no-shadowed-variable
      private EmployeeService: EmployeeService,
      private $state: StateService,
    ) {}

    public create(employee: Employee) {
      this.hasError = false;
      this.EmployeeService.create(employee)
        .then(() => this.$state.go("employees"))
        .catch(_ => (this.hasError = true));
    }

    public onUpdate = (employee: Employee) => {
      this.employee = angular.copy(employee);
    };
  },
  // TODO separate out template
  template: `
    <h2>Add an employee</h2>
    <form ng-submit="$ctrl.create($ctrl.employee)">
      <employee-form employee="$ctrl.employee" on-update="$ctrl.onUpdate"></employee-form>
      <button type="submit">Create</button>
      <p class="error" ng-if="$ctrl.hasError">Something went wrong!</p>
    </form>
  `,
};

const name = angular
  .module("createEmployeeComponent", [uiRouterModule])
  .component("createEmployee", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("createEmployee", {
      component: "createEmployee",
      data: {
        requireAuth: true,
      },
      url: "/employee/create",
    });
  }).name;

export default name;
