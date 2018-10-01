import { default as uiRouterModule, StateService } from "@uirouter/angularjs";
import angular, { IPromise, IQService } from "angular";
import firebase from "firebase";

import { Employee } from "common/employeeTypes";

export class EmployeeService {
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private $q: IQService, private $state: StateService) {}

  public fetchEmployees(): IPromise<{ [uid: string]: Employee }> {
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

  public fetch(uid: string): IPromise<Employee> {
    return this.fetchEmployees().then(
      employees => (employees[uid] ? employees[uid] : this.$q.reject()),
    );
  }

  public create(employee: Employee) {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      this.$state.go("login");
      return this.$q.reject();
    }
    const ref = `/users/${currentUser.uid}/employees`;
    return this.$q((resolve, reject) =>
      firebase
        .database()
        .ref(ref)
        .push(employee)
        .then(x => resolve(x), e => reject(e)),
    );
  }

  public save(uid: string, employee: Employee) {
    const { currentUser } = firebase.auth();
    if (currentUser === null) {
      this.$state.go("login");
      return this.$q.reject();
    }
    const ref = `/users/${currentUser.uid}/employees/${uid}`;
    return this.$q.resolve(
      firebase
        .database()
        .ref(ref)
        .set(employee),
    );
  }
}

export const employeeServiceModule = angular
  .module("employee.service", [uiRouterModule])
  .service("EmployeeService", EmployeeService).name;
