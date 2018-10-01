jest.mock("firebase");

import { StateService } from "@uirouter/angularjs";
import angular, { ICompileService, ILocationService, IQService } from "angular";
import "angular-mocks";
import firebase from "firebase";

import { Employee, ShiftDay } from "common/employeeTypes";
import { authModule } from "components/auth";
import { EmployeeService, employeeServiceModule } from "components/employee";

import editComponent from "./edit.component";
import formComponent from "./form.component";

describe("employee edit form", () => {
  let render: (employee?: Employee) => JQLite;
  let scope: any;
  let state: StateService;
  let $q: IQService;
  let service: EmployeeService;
  let $location: ILocationService;
  const user = { uid: "userUid" };
  const uid = "employeeUid";
  const employee = {
    employeeName: "Taylor",
    phone: "555-5555",
    shift: ShiftDay.Monday,
  };
  const goTo = (url: string) => {
    $location.url(url);
    scope.$apply();
  };

  beforeEach(
    angular.mock.module(
      editComponent,
      formComponent,
      authModule,
      employeeServiceModule,
    ),
  );
  beforeEach(
    angular.mock.inject(
      // tslint:disable:variable-name
      (
        $rootScope,
        $compile: ICompileService,
        _$q_: IQService,
        $state: StateService,
        _EmployeeService_: EmployeeService,
        _$location_: ILocationService,
        // tslint:enable:variable-name
      ) => {
        service = _EmployeeService_;
        $q = _$q_;
        state = $state;
        scope = $rootScope.$new();
        $location = _$location_;
        render = () => {
          const ele = $compile(`<div><ui-view></ui-view></div>`)(scope);
          scope.$digest();
          return ele;
        };
        jest
          .spyOn(service, "fetchEmployees")
          .mockImplementation(() => $q.resolve({ [uid]: employee }));
      },
    ),
  );

  it(
    "requires authentication",
    angular.mock.inject(AuthService => {
      // Check that with authentication it works
      jest.spyOn(AuthService, "isAuthenticated").mockImplementation(() => true);
      goTo("employee/1");
      expect(state.current.name).toEqual("editEmployee");

      // Check that without authentication it fails
      AuthService.isAuthenticated.mockImplementation(() => false);
      state.reload();
      scope.$apply();
      expect(state.current.name).not.toEqual("editEmployee");
    }),
  );

  describe("when the save button is clicked", () => {
    beforeEach(() => {
      (firebase.auth as any).mockImplementation(() => ({ currentUser: user }));
      jest.spyOn(service, "save").mockImplementation(() => $q.resolve());
      jest.spyOn(state, "go").mockImplementation(() => null);
      goTo(`employee/${uid}`);
    });

    it("uses EmployeeService to save the employee", () => {
      const employeeName = "Casey";
      const phone = "123-456-7890";
      const element = render(employee);
      const fill = (selector: string, val: any) =>
        element
          .find(selector)
          .val(val)
          .triggerHandler("input");

      fill("input[name=name]", employeeName);
      fill("input[name=phone]", phone);
      // TODO selecting shifts doesn't work well with angular's system for select options
      scope.$apply();
      element.find("button.save").triggerHandler("click");

      expect(service.save).toHaveBeenCalledTimes(1);
      expect(service.save).toHaveBeenCalledWith(uid, {
        ...employee,
        employeeName,
        phone,
      });
    });

    describe("when saving is successful", () => {
      beforeEach(() => {
        jest.spyOn(service, "save").mockImplementation(() => $q.resolve());
      });

      it("redirects to the employee list", () => {
        const element = render();

        element.find("button.save").triggerHandler("click");

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("employees");
      });
    });

    describe("when saving fails", () => {
      beforeEach(() => {
        jest.spyOn(service, "save").mockImplementation(() => $q.reject());
      });

      it("shows an error message", () => {
        const element = render();

        element.find("button.save").triggerHandler("click");

        expect(element.find(".error")[0].outerHTML).toMatchSnapshot();
      });

      describe("when resubmitted", () => {
        it("clears the error message", () => {
          const element = render();
          element.find("button.save").triggerHandler("click");

          jest.spyOn(service, "save").mockImplementation(() => $q(() => null));
          element.find("button.save").triggerHandler("click");

          expect(element.find(".error").length).toBe(0);
        });
      });
    });
  });
});
