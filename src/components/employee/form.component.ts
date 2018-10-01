import angular, { IComponentOptions, IOnChangesObject } from "angular";

import { Employee, ShiftDay } from "common/employeeTypes";

const config: IComponentOptions = {
  bindings: {
    employee: "<",
    onUpdate: "<",
  },
  controller: class EmployeeFormController {
    public options = ShiftDay;
    public employee: Employee | {} = {};

    public $onChanges(changes: IOnChangesObject) {
      if (changes.employee) {
        this.employee = angular.copy(changes.employee.currentValue);
      }
    }
  },
  template: `
    <label>Name
      <input name="name" type="text" placeholder="Taylor" ng-model="$ctrl.employee.employeeName" ng-change="$ctrl.onUpdate($ctrl.employee)" />
    </label>
    <label>Phone
      <input name="phone" type="text" placeholder="555-555-5555" ng-model="$ctrl.employee.phone"  ng-change="$ctrl.onUpdate($ctrl.employee)"/>
    </label>
    <label>Shift
      <select name="shift"
        ng-model="$ctrl.employee.shift"
        ng-options="value as humanized for (value, humanized) in $ctrl.options"
        ng-change="$ctrl.onUpdate($ctrl.employee)"
      ></select>
    </label>
  `,
};

const name = angular
  .module("employeeFormComponent", [])
  .component("employeeForm", config).name;

export default name;
