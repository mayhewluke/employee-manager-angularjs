jest.mock("components/employee/employee.service");

import angular, { ICompileService, IQService } from "angular";
import "angular-mocks";

import { fetchEmployees } from "components/employee";

import listComponent from "./list.component";

describe("employee listComponent", () => {
  let render: (email?: string) => JQLite;
  let scope: any;
  let $q: IQService;
  const employees = {
    uid1: { employeeName: "Taylor", phone: "555-5555", shift: "Monday" },
    uid2: { employeeName: "Casey", phone: "123-456-7890", shift: "Friday" },
  };

  beforeEach(angular.mock.module(listComponent));
  beforeEach(
    angular.mock.inject(
      // tslint:disable-next-line:variable-name
      ($rootScope, $compile: ICompileService, _$q_: IQService) => {
        $q = _$q_;
        scope = $rootScope.$new();
        render = () => {
          const ele = $compile(`<employees></employees>`)(scope);
          scope.$digest();
          return ele;
        };
        (fetchEmployees as any).mockImplementation(() => $q(() => null));
      },
    ),
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
      (fetchEmployees as any).mockImplementation(() => $q.resolve(employees));
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
      (fetchEmployees as any).mockImplementation(() => $q.reject());
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
