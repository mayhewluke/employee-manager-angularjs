import { default as uiRouterModule, StateService } from "@uirouter/angularjs";
import angular, { IQService } from "angular";
import firebase from "firebase";

export class EmployeeService {
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private $q: IQService, private $state: StateService) {}

  public fetchEmployees() {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      this.$state.go("login");
      return this.$q.reject();
    }
    const ref = `/users/${currentUser.uid}/employees`;
    return this.$q
      .resolve(
        firebase
          .database()
          .ref(ref)
          .once("value"),
      )
      .then(snapshot => snapshot.val());
  }

  public fetch(uid: string) {
    return this.fetchEmployees().then(
      employees => (employees[uid] ? employees[uid] : this.$q.reject()),
    );
  }
}

export const employeeServiceModule = angular
  .module("employee.service", [uiRouterModule])
  .service("EmployeeService", EmployeeService).name;
