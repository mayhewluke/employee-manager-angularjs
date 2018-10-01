import {
  default as uiRouterModule,
  StateProvider,
  StateService,
  Transition,
} from "@uirouter/angularjs";
import angular, { IComponentOptions } from "angular";

import { Employee, ShiftDay } from "common/employeeTypes";

import { EmployeeService } from "./employee.service";

const config: IComponentOptions = {
  bindings: { transition: "<" },
  controller: class EditEmployeeController {
    public employee: Employee = {
      employeeName: "",
      phone: "",
      shift: ShiftDay.Monday,
    };
    public employeeUid: string = "";
    public hasError: boolean = false;
    private transition!: Transition;

    /* @ngInject */
    constructor(
      // tslint:disable-next-line:no-shadowed-variable
      private EmployeeService: EmployeeService,
      private $state: StateService,
    ) {}

    public $onInit() {
      this.employeeUid = this.transition.params().employeeUid;
      this.EmployeeService.fetch(this.employeeUid).then(
        employee => (this.employee = employee),
      );
    }

    public save(uid: string, employee: Employee) {
      this.hasError = false;
      this.EmployeeService.save(uid, employee)
        .then(() => this.$state.go("employees"))
        .catch(_ => (this.hasError = true));
    }

    public remove(uid: string) {
      this.hasError = false;
      this.EmployeeService.remove(uid)
        .then(() => this.$state.go("employees"))
        .catch(_ => (this.hasError = true));
    }

    public onUpdate = (employee: Employee) => {
      this.employee = angular.copy(employee);
    };
  },
  // TODO separate out template
  template: require("./edit.component.html"),
};

const name = angular
  .module("editEmployeeComponent", [uiRouterModule])
  .component("editEmployee", config)
  .config(
    /* @ngInject */
    ($stateProvider: StateProvider) => {
      $stateProvider.state("editEmployee", {
        bindings: { transition: "$transition$" },
        component: "editEmployee",
        data: {
          requireAuth: true,
        },
        url: "/employee/:employeeUid",
      });
    },
  ).name;

export default name;
