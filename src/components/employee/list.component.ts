import { default as uiRouterModule, StateProvider } from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { Employee } from "common/employeeTypes";

import { EmployeeService } from "./employee.service";

const config: IComponentOptions = {
  controller: class EmployeeListController {
    public employees: { [uid: string]: Employee } = {};
    public isLoading: boolean = true;
    public hasError: boolean = false;

    // tslint:disable-next-line:no-shadowed-variable
    constructor(private EmployeeService: EmployeeService) {}

    // TODO use route resolve
    public $onInit() {
      this.isLoading = true; // Don't rely on implicit state
      this.EmployeeService.fetchEmployees()
        .then(employees => {
          this.employees = employees;
        })
        .catch(() => (this.hasError = true))
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  // TODO separate out template
  template: `
    <h2>Employees</h2>
    <a ui-sref="createEmployee">Add an employee</a>
    <p class="loading" ng-if="$ctrl.isLoading">Loading...</p>
    <p class="error" ng-if="$ctrl.hasError">Something went wrong!</p>
    <div ng-repeat="(uid, employee) in $ctrl.employees">
      <a ui-sref="employee({ employeeUid: uid })">{{ employee.employeeName }}</a>
    </div>
  `,
};

const name = angular
  .module("employeeListComponent", [uiRouterModule])
  .component("employees", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("employees", {
      component: "employees",
      data: {
        requireAuth: true,
      },
      url: "/employees",
    });
  }).name;

export default name;
