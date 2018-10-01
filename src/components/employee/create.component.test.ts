import { StateService } from "@uirouter/angularjs";
import angular, { ICompileService, ILocationService, IQService } from "angular";
import "angular-mocks";

import { Employee, ShiftDay } from "common/employeeTypes";
import { authModule } from "components/auth";
import { EmployeeService, employeeServiceModule } from "components/employee";

import createComponent from "./create.component";
import formComponent from "./form.component";

describe("employee create form", () => {
  let render: (employee?: Employee) => JQLite;
  let scope: any;
  let state: StateService;
  let $q: IQService;
  let service: EmployeeService;
  let $location: ILocationService;
  const goTo = (url: string) => {
    $location.url(url);
    scope.$apply();
  };

  beforeEach(
    angular.mock.module(
      createComponent,
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
          const ele = $compile(`<create-employee></create-employee>`)(scope);
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
    angular.mock.inject(AuthService => {
      // Check that with authentication it works
      jest.spyOn(AuthService, "isAuthenticated").mockImplementation(() => true);
      goTo("employee/create");
      expect(state.current.name).toEqual("createEmployee");

      // Check that without authentication it fails
      AuthService.isAuthenticated.mockImplementation(() => false);
      state.reload();
      scope.$apply();
      expect(state.current.name).not.toEqual("createEmployee");
    }),
  );

  describe("when submitted", () => {
    beforeEach(() => {
      jest.spyOn(service, "create").mockImplementation(() => $q.resolve());
      jest.spyOn(state, "go").mockImplementation(() => null);
    });

    it("uses EmployeeService to create the employee", () => {
      const employeeName = "Casey";
      const phone = "123-456-7890";
      const shift = ShiftDay.Monday;
      const newEmployee: Employee = { employeeName, phone, shift };
      const element = render();
      const fill = (selector: string, val: any) =>
        element
          .find(selector)
          .val(val)
          .triggerHandler("input");

      fill("input[name=name]", employeeName);
      fill("input[name=phone]", phone);
      // TODO selecting shifts doesn't work well with angular's system for select options
      scope.$apply();
      element.find("form").triggerHandler("submit");

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(newEmployee);
    });

    describe("when creation is successful", () => {
      beforeEach(() => {
        jest.spyOn(service, "create").mockImplementation(() => $q.resolve());
      });

      it("redirects to the employee list", () => {
        const element = render();

        element.find("form").triggerHandler("submit");

        expect(state.go).toHaveBeenCalledTimes(1);
        expect(state.go).toHaveBeenCalledWith("employees");
      });
    });

    describe("when creation fails", () => {
      beforeEach(() => {
        jest.spyOn(service, "create").mockImplementation(() => $q.reject());
      });

      it("shows an error message", () => {
        const element = render();

        element.find("form").triggerHandler("submit");

        expect(element.find(".error")[0].outerHTML).toMatchSnapshot();
      });

      describe("when resubmitted", () => {
        it("clears the error message", () => {
          const element = render();
          element.find("form").triggerHandler("submit");

          jest
            .spyOn(service, "create")
            .mockImplementation(() => $q(() => null));
          element.find("form").triggerHandler("submit");

          expect(element.find(".error").length).toBe(0);
        });
      });
    });
  });
});
