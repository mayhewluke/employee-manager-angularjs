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
  template: `
    <h2>Edit {{ $ctrl.employee.employeeName }}</h2>
    <form>
      <employee-form employee="$ctrl.employee" on-update="$ctrl.onUpdate"></employee-form>
      <button type="button" class="save" ng-click="$ctrl.save($ctrl.employeeUid, $ctrl.employee)">Save</button>
      <button type="button" class="delete" ng-click="$ctrl.remove($ctrl.employeeUid)">Delete</button>
      <p class="error" ng-if="$ctrl.hasError">Something went wrong!</p>
    </form>
  `,
};

const name = angular
  .module("editEmployeeComponent", [uiRouterModule])
  .component("editEmployee", config)
  .config(($stateProvider: StateProvider) => {
    $stateProvider.state("editEmployee", {
      bindings: { transition: "$transition$" },
      component: "editEmployee",
      data: {
        requireAuth: true,
      },
      url: "/employee/:employeeUid",
    });
  }).name;

export default name;
