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
  template: require("./form.component.html"),
};

const name = angular
  .module("employeeFormComponent", [])
  .component("employeeForm", config).name;

export default name;
