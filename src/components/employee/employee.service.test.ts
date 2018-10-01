jest.mock("firebase");

import { StateService } from "@uirouter/angularjs";
import angular, { IQService, IScope } from "angular";
import "angular-mocks";
import firebase from "firebase";

import { Employee, ShiftDay } from "common/employeeTypes";

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

  describe("fetch", () => {
    describe("when the employee exists", () => {
      it("pulls the employee with the uid from fetchEmployees", async () => {
        const uid = "uid1";
        const employee = {};
        const employees = { [uid]: employee, foo: {} };
        jest
          .spyOn(service, "fetchEmployees")
          .mockImplementation(() => $q.resolve(employees));

        process.nextTick(() => scope.$apply());
        await expect(service.fetch(uid)).resolves.toBe(employee);
      });
    });

    describe("when the employee doesn't exist", () => {
      it("rejects with undefined", async () => {
        const employees = {};
        jest
          .spyOn(service, "fetchEmployees")
          .mockImplementation(() => $q.resolve(employees));

        process.nextTick(() => scope.$apply());
        await expect(service.fetch("")).rejects.toBeUndefined();
      });
    });

    describe("when fetchEmployee rejects", () => {
      it("rejects with the same value", async () => {
        const error = new Error("Error");
        jest
          .spyOn(service, "fetchEmployees")
          .mockImplementation(() => $q.reject(error));

        process.nextTick(() => scope.$apply());
        await expect(service.fetch("")).rejects.toBe(error);
      });
    });
  });

  describe("create", () => {
    const employee: Employee = {
      employeeName: "Taylor",
      phone: "555-555-5555",
      shift: ShiftDay.Monday,
    };
    const mockRef = jest.fn();
    const mockPush = jest.fn();
    const user = { uid: "userUid" };
    beforeEach(() => {
      (firebase.database as any).mockImplementation(() => ({ ref: mockRef }));
      mockRef.mockImplementation(() => ({ push: mockPush }));
    });

    describe("when not logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: null,
        }));
      });

      it("redirects to the login page", () => {
        jest.spyOn(state, "go");

        service.create(employee);

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("login");
      });

      it("does not try to save the employee", () => {
        process.nextTick(() => scope.$apply());
        service.create(employee);

        expect(mockPush).not.toHaveBeenCalled();
      });

      it("rejects the promise with undefined", async () => {
        process.nextTick(() => scope.$apply());
        await expect(service.create(employee)).rejects.toBeUndefined();
      });
    });

    describe("when logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: user,
        }));
      });

      it("saves the employee to firebase", () => {
        const refPath = `/users/${user.uid}/employees`;
        mockPush.mockImplementation(() => $q.resolve());

        service.create(employee);

        expect(mockRef).toHaveBeenCalledTimes(1);
        expect(mockRef).toHaveBeenCalledWith(refPath);

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith(employee);
      });

      describe("when saving succeeds", () => {
        it("resolves with the response from firebase", async () => {
          const response = "response";
          mockPush.mockImplementation(() => Promise.resolve(response));

          process.nextTick(() => scope.$apply());
          await expect(service.create(employee)).resolves.toEqual(response);
        });
      });

      describe("when saving fails", () => {
        it("rejects with the error from firebase", async () => {
          const error = new Error("Error");
          mockPush.mockImplementation(() => Promise.reject(error));

          process.nextTick(() => scope.$apply());
          await expect(service.create(employee)).rejects.toEqual(error);
        });
      });
    });
  });

  describe("save", () => {
    const employee: Employee = {
      employeeName: "Taylor",
      phone: "555-555-5555",
      shift: ShiftDay.Monday,
    };
    const uid: string = "employeeUid";
    const mockRef = jest.fn();
    const mockSet = jest.fn();
    const user = { uid: "userUid" };
    const doSave = () => service.save(uid, employee);
    beforeEach(() => {
      (firebase.database as any).mockImplementation(() => ({ ref: mockRef }));
      mockRef.mockImplementation(() => ({ set: mockSet }));
    });

    describe("when not logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: null,
        }));
      });

      it("redirects to the login page", () => {
        jest.spyOn(state, "go");

        doSave();

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("login");
      });

      it("does not try to save the employee", () => {
        process.nextTick(() => scope.$apply());
        doSave();

        expect(mockSet).not.toHaveBeenCalled();
      });

      it("rejects the promise with undefined", async () => {
        process.nextTick(() => scope.$apply());
        await expect(doSave()).rejects.toBeUndefined();
      });
    });

    describe("when logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: user,
        }));
      });

      it("saves the employee to firebase", () => {
        const refPath = `/users/${user.uid}/employees/${uid}`;
        mockSet.mockImplementation(() => $q.resolve());

        doSave();

        expect(mockRef).toHaveBeenCalledTimes(1);
        expect(mockRef).toHaveBeenCalledWith(refPath);

        expect(mockSet).toHaveBeenCalledTimes(1);
        expect(mockSet).toHaveBeenCalledWith(employee);
      });

      describe("when saving succeeds", () => {
        it("resolves with the response from firebase", async () => {
          const response = "response";
          mockSet.mockImplementation(() => Promise.resolve(response));

          process.nextTick(() => scope.$apply());
          await expect(doSave()).resolves.toEqual(response);
        });
      });

      describe("when saving fails", () => {
        it("rejects with the error from firebase", async () => {
          const error = new Error("Error");
          mockSet.mockImplementation(() => Promise.reject(error));

          process.nextTick(() => scope.$apply());
          await expect(doSave()).rejects.toEqual(error);
        });
      });
    });
  });

  describe("remove", () => {
    const uid: string = "employeeUid";
    const mockRef = jest.fn();
    const mockRemove = jest.fn();
    const user = { uid: "userUid" };
    const doRemove = () => service.remove(uid);
    beforeEach(() => {
      (firebase.database as any).mockImplementation(() => ({ ref: mockRef }));
      mockRef.mockImplementation(() => ({ remove: mockRemove }));
    });

    describe("when not logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: null,
        }));
      });

      it("redirects to the login page", () => {
        jest.spyOn(state, "go");

        doRemove();

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("login");
      });

      it("does not try to remove the employee", () => {
        process.nextTick(() => scope.$apply());
        doRemove();

        expect(mockRemove).not.toHaveBeenCalled();
      });

      it("rejects the promise with undefined", async () => {
        process.nextTick(() => scope.$apply());
        await expect(doRemove()).rejects.toBeUndefined();
      });
    });

    describe("when logged in", () => {
      beforeEach(() => {
        (firebase.auth as any).mockImplementation(() => ({
          currentUser: user,
        }));
      });

      it("removes the employee from firebase", () => {
        const refPath = `/users/${user.uid}/employees/${uid}`;
        mockRemove.mockImplementation(() => $q.resolve());

        doRemove();

        expect(mockRef).toHaveBeenCalledTimes(1);
        expect(mockRef).toHaveBeenCalledWith(refPath);

        expect(mockRemove).toHaveBeenCalledTimes(1);
      });

      describe("when removal succeeds", () => {
        it("resolves with the response from firebase", async () => {
          const response = "response";
          mockRemove.mockImplementation(() => Promise.resolve(response));

          process.nextTick(() => scope.$apply());
          await expect(doRemove()).resolves.toEqual(response);
        });
      });

      describe("when removal fails", () => {
        it("rejects with the error from firebase", async () => {
          const error = new Error("Error");
          mockRemove.mockImplementation(() => Promise.reject(error));

          process.nextTick(() => scope.$apply());
          await expect(doRemove()).rejects.toEqual(error);
        });
      });
    });
  });
});
