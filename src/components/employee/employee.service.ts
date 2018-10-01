import angular from "angular";

export class EmployeeService {
  private dummyEmployees = {
    uid1: { employeeName: "Taylor", phone: "555-5555", shift: "Monday" },
    uid2: { employeeName: "Casey", phone: "123-456-7890", shift: "Friday" },
  };

  public fetchEmployees() {
    return Promise.resolve(this.dummyEmployees);
  }
}

export const employeeServiceModule = angular
  .module("employee.service", [])
  .service("EmployeeService", EmployeeService).name;
