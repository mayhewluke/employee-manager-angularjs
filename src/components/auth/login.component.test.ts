jest.mock("components/auth/auth.service");

import angular, { ICompileService, IQService } from "angular";
import "angular-mocks";

import { logIn } from "components/auth";

import loginComponent from "./login.component";

describe("loginComponent", () => {
  let render: (email?: string) => JQLite;
  let scope: any;
  let $q: IQService;
  beforeEach(angular.mock.module(loginComponent));
  beforeEach(
    angular.mock.inject(
      // tslint:disable-next-line:variable-name
      ($rootScope, $compile: ICompileService, _$q_: IQService) => {
        $q = _$q_;
        scope = $rootScope.$new();
        render = email => {
          scope.email = email;
          const ele = $compile(`<login email="email"></login>`)(scope);
          scope.$digest();
          return ele;
        };
        (logIn as any).mockImplementation(() => $q(() => null));
      },
    ),
  );

  it("does not show an error when first rendered", () => {
    const element = render();

    expect(element.find(".error").length).toBe(0);
  });

  describe("when an email is passed in", () => {
    it("prepopulates the email input", () => {
      const email = "user@domain.com";
      const element = render(email);

      expect(element.find("input[name=email]").val()).toEqual(email);
    });
  });

  describe("when no email is passed in", () => {
    it("leaves the email input blank", () => {
      const element = render();

      expect(element.find("input[name=email]").val()).toEqual("");
    });
  });

  describe("when submitted", () => {
    it("attempts to log in", () => {
      const email = "user@example.com";
      const password = "somethingsecret";
      const element = render();

      element
        .find("input[name='email']")
        .val(email)
        .triggerHandler("input");
      element
        .find("input[name='password']")
        .val(password)
        .triggerHandler("input");

      element.find("form").triggerHandler("submit");

      expect(logIn).toHaveBeenCalledTimes(1);
      expect(logIn).toHaveBeenCalledWith(email, password);
    });

    describe("when logging in fails", () => {
      let element: JQLite;
      beforeEach(() => {
        (logIn as any).mockImplementation(() => $q.reject());
        element = render();

        element.find("form").triggerHandler("submit");
        scope.$digest();
      });

      it("shows an error message", () => {
        expect(element.find(".error")[0].outerHTML).toMatchSnapshot();
      });

      describe("when resubmitted", () => {
        it("clears the error message", () => {
          (logIn as any).mockImplementation(() => $q.resolve());

          element.find("form").triggerHandler("submit");
          scope.$digest();

          expect(element.find(".error").length).toBe(0);
        });
      });
    });
  });
});
