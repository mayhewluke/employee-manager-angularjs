jest.mock("firebase");

import { StateService } from "@uirouter/angularjs";
import angular, { IQService, IScope } from "angular";
import "angular-mocks";
import firebase from "firebase";

import { EmployeeService, employeeServiceModule } from "./employee.service";

describe("employee service", () => {
  let service: EmployeeService;
  let scope: IScope;
  let state: StateService;
  let $q: IQService;
  beforeEach(angular.mock.module(employeeServiceModule));
  beforeEach(
    angular.mock.inject((
      // tslint:disable:variable-name
      _EmployeeService_: EmployeeService,
      $rootScope: IScope,
      $state: StateService,
      _$q_: IQService,
      // tslint:enable:variable-name
    ) => {
      service = _EmployeeService_;
      scope = $rootScope;
      state = $state;
      $q = _$q_;
    }),
  );

  describe("fetchEmployees", () => {
    const mockRef = jest.fn();
    const mockOnce = jest.fn();
    let user: { uid: string };
    beforeEach(() => {
      (firebase.database as any).mockImplementation(() => ({ ref: mockRef }));
      mockRef.mockImplementation(() => ({ once: mockOnce }));
      mockOnce.mockImplementation(() => $q.resolve());
      user = { uid: "userUid" };
    });

    describe("when not logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: null,
        }));
      });

      it("redirects to the login state", () => {
        jest.spyOn(state, "go");

        service.fetchEmployees();

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("login");
      });

      it("rejects the promise with undefined", async () => {
        process.nextTick(() => scope.$apply());
        await expect(service.fetchEmployees()).rejects.toBeUndefined();
      });
    });

    describe("when logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: user,
        }));
      });

      it("asks firebase for the user's employees", () => {
        service.fetchEmployees();

        expect(mockRef).toHaveBeenCalledTimes(1);
        expect(mockRef).toHaveBeenCalledWith(`/users/${user.uid}/employees`);

        expect(mockOnce).toHaveBeenCalledTimes(1);
        expect(mockOnce.mock.calls[0][0]).toBe("value");
      });

      describe("when the request succeeds", () => {
        const employees = {};
        const snapshot = { val: () => employees };
        beforeEach(() => {
          mockOnce.mockImplementation(() => $q.resolve(snapshot));
        });

        it("resolves the promise with the employees", async () => {
          process.nextTick(() => scope.$apply());
          await expect(service.fetchEmployees()).resolves.toBe(employees);
        });
      });

      describe("when the success fails", () => {
        const error = new Error("Error");
        beforeEach(() => {
          mockOnce.mockImplementation(() => $q.reject(error));
        });

        it("rejects the employee with the error from firebase", async () => {
          process.nextTick(() => scope.$apply());
          await expect(service.fetchEmployees()).rejects.toBe(error);
        });
      });
    });
  });
});
