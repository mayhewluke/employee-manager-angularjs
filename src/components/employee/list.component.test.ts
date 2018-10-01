import angular, { ICompileService, IQService } from "angular";
import "angular-mocks";

import { Employee, ShiftDay } from "common/employeeTypes";
import { authModule } from "components/auth";
import { EmployeeService, employeeServiceModule } from "components/employee";

import listComponent from "./list.component";

describe("employee listComponent", () => {
  let render: (email?: string) => JQLite;
  let scope: any;
  let $q: IQService;
  let service: EmployeeService;
  const employees: { [uid: string]: Employee } = {
    uid1: { employeeName: "Taylor", phone: "555-5555", shift: ShiftDay.Monday },
    uid2: {
      employeeName: "Casey",
      phone: "123-456-7890",
      shift: ShiftDay.Friday,
    },
  };

  beforeEach(
    angular.mock.module(listComponent, authModule, employeeServiceModule),
  );
  beforeEach(
    angular.mock.inject(
      // tslint:disable:variable-name
      (
        $rootScope,
        $compile: ICompileService,
        _$q_: IQService,
        _EmployeeService_: EmployeeService,
        // tslint:enable:variable-name
      ) => {
        service = _EmployeeService_;
        $q = _$q_;
        scope = $rootScope.$new();
        render = () => {
          const ele = $compile(`<employees></employees>`)(scope);
          scope.$digest();
          return ele;
        };
        jest
          .spyOn(service, "fetchEmployees")
          .mockImplementation(() => $q(() => null));
      },
    ),
  );

  it(
    "requires authentication",
    angular.mock.inject(($state, $rootScope, AuthService) => {
      jest
        .spyOn(AuthService, "isAuthenticated")
        .mockImplementation(() => false);

      $state.go("employees");
      $rootScope.$apply();

      expect($state.current.name).not.toEqual("employees");
    }),
  );

  describe("when data has not yet loaded", () => {
    it("shows a loading message", () => {
      const element = render();

      expect(element.find(".loading")[0].outerHTML).toMatchSnapshot();
    });

    it("does not display the error message", () => {
      const element = render();

      expect(element.find(".error").length).toBe(0);
    });
  });

  describe("when employees are fetched", () => {
    beforeEach(() => {
      (service.fetchEmployees as any).mockImplementation(() =>
        $q.resolve(employees),
      );
    });

    it("lists the employees", () => {
      const element = render();

      expect(element.html()).toMatchSnapshot();
    });

    it("does not display the loading message", () => {
      const element = render();

      expect(element.find(".loading").length).toBe(0);
    });

    it("does not display the error message", () => {
      const element = render();

      expect(element.find(".error").length).toBe(0);
    });
  });

  describe("when fetching employees fails", () => {
    beforeEach(() => {
      (service.fetchEmployees as any).mockImplementation(() => $q.reject());
    });

    it("shows an error message", () => {
      const element = render();

      expect(element.find(".error")[0].outerHTML).toMatchSnapshot();
    });

    it("does not show the loading message", () => {
      const element = render();

      expect(element.find(".loading").length).toBe(0);
    });
  });
});
