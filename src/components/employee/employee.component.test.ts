import { StateService } from "@uirouter/angularjs";
import angular, { ICompileService, ILocationService, IQService } from "angular";
import "angular-mocks";
import firebase from "firebase";

import { Employee, ShiftDay } from "common/employeeTypes";
import { authModule } from "components/auth";
import { EmployeeService, employeeServiceModule } from "components/employee";

import employeeComponent from "./employee.component";

describe("employee view component", () => {
  let render: () => JQLite;
  let scope: any;
  let state: StateService;
  let $q: IQService;
  let service: EmployeeService;
  let $location: ILocationService;
  const employee: Employee = {
    employeeName: "Taylor",
    phone: "555-5555",
    shift: ShiftDay.Monday,
  };
  const uid = "uid1";
  const goTo = (url: string) => {
    $location.url(url);
    scope.$apply();
  };
  beforeEach(
    angular.mock.module(employeeComponent, authModule, employeeServiceModule),
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
        $q = _$q_;
        scope = $rootScope.$new();
        state = $state;
        service = _EmployeeService_;
        $location = _$location_;
        render = () => {
          // Can't be a bare <ui-view> - needs a wrapper element
          const ele = $compile(`<div><ui-view></ui-view></div>`)(scope);
          scope.$digest();
          return ele;
        };
      },
    ),
  );

  it(
    "requires authentication",
    angular.mock.inject(AuthService => {
      // Check that with authentication it works
      jest.spyOn(AuthService, "isAuthenticated").mockImplementation(() => true);
      goTo("employee/foo");
      expect(state.current.name).toEqual("employee");

      // Check that without authentication it fails
      AuthService.isAuthenticated.mockImplementation(() => false);
      state.reload();
      scope.$apply();
      expect(state.current.name).not.toEqual("employee");
    }),
  );

  describe("when logged in", () => {
    beforeEach(() => {
      jest
        .spyOn(firebase, "auth")
        .mockImplementation(() => ({ currentUser: { uid } }));
    });

    it("displays the employee", () => {
      const employees = { [uid]: employee };
      jest
        .spyOn(service, "fetchEmployees")
        .mockImplementation(() => $q.resolve(employees));

      const element = render();
      goTo(`employee/${uid}`);

      expect(element.find("employee").html()).toMatchSnapshot();
    });
  });
});
