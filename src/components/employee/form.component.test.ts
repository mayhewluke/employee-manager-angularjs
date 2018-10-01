import angular, { ICompileService } from "angular";
import "angular-mocks";

import { Employee, ShiftDay } from "common/employeeTypes";
import { authModule } from "components/auth";

import formComponent from "./form.component";

describe("employee form component", () => {
  let render: (employee?: Employee) => JQLite;
  let scope: any;
  const testEmployee: Employee = {
    employeeName: "Taylor",
    phone: "555-5555",
    shift: ShiftDay.Monday,
  };

  beforeEach(angular.mock.module(formComponent, authModule));
  beforeEach(
    angular.mock.inject(($rootScope, $compile: ICompileService) => {
      scope = $rootScope.$new();
      render = employee => {
        scope.employee = employee;
        const ele = $compile(
          `<employee-form employee="employee"></employee-form>`,
        )(scope);
        scope.$digest();
        return ele;
      };
    }),
  );

  it("renders properly", () => {
    expect(render().html()).toMatchSnapshot();
  });

  it("prepopulates the fields with the given employee's values", () => {
    const element = render(testEmployee);

    expect(element.find("input[name=name]").val()).toEqual(
      testEmployee.employeeName,
    );
    expect(element.find("input[name=phone]").val()).toEqual(testEmployee.phone);
    // Can't match on .val() because AngularJS inserts extra data into that attr
    expect(element.find("select[name=shift] option[selected]").text()).toEqual(
      ShiftDay[testEmployee.shift],
    );
  });

  it("doesn't affect the passed in employee", () => {
    const orig = angular.copy(testEmployee);
    const element = render(testEmployee);

    element
      .find("input[name=name]")
      .val("foo")
      .triggerHandler("input");
    element
      .find("input[name=phone]")
      .val("123-456-7890")
      .triggerHandler("input");
    // TODO this one does not work - figure out what handler needs to be used to make this update
    element
      .find("select[name=shift]")
      .val("Friday")
      .triggerHandler("input");

    expect(testEmployee).toEqual(orig);
  });
});
