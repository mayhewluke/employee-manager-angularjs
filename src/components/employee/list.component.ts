import { default as uiRouterModule, StateProvider } from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { fetchEmployees } from "./employee.service";

interface Employee {
  employeeName: string;
  phone: string;
  shift: string; // TODO use ShiftDay enum a la employee-manager-react-native
}

const config: IComponentOptions = {
  controller: class EmployeeListController {
    public employees: { [uid: string]: Employee } = {};
    public isLoading: boolean = true;
    public hasError: boolean = false;

    // TODO use route resolve
    public $onInit() {
      this.isLoading = true; // Don't rely on implicit state
      fetchEmployees()
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
    <p class="loading" ng-if="$ctrl.isLoading">Loading...</p>
    <p class="error" ng-if="$ctrl.hasError">Something went wrong!</p>
    <div ng-repeat="(uid, employee) in $ctrl.employees">
      {{ employee.employeeName }}
    </div>
  `,
};

const name = angular
  .module("employeeListComponent", [uiRouterModule])
  .component("employees", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("employees", {
      component: "employees",
      url: "/employees",
    });
  }).name;

export default name;
