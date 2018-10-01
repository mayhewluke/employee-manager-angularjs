import { default as uiRouterModule, StateProvider } from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { Employee } from "common/employeeTypes";

import { EmployeeService } from "./employee.service";

const config: IComponentOptions = {
  controller: class EmployeeListController {
    public employees: { [uid: string]: Employee } = {};
    public isLoading: boolean = true;
    public hasError: boolean = false;

    /* @ngInject */
    constructor(private EmployeeService: EmployeeService) {} // tslint:disable-line:no-shadowed-variable

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
  template: require("./list.component.html"),
};

const name = angular
  .module("employeeListComponent", [uiRouterModule])
  .component("employees", config)
  .config(
    /* @ngInject */
    ($stateProvider: StateProvider) => {
      $stateProvider.state("employees", {
        component: "employees",
        data: {
          requireAuth: true,
        },
        url: "/employees",
      });
    },
  ).name;

export default name;
