import { StateService } from "@uirouter/angularjs";
import angular, { ICompileService, IScope } from "angular";
import "angular-mocks";
import firebase from "firebase/app";

import initComponent from "./init.component";

describe("initComponent", () => {
  const onChange = jest.fn();
  let render: () => JQLite;
  let scope: IScope;
  let state: StateService;
  beforeEach(angular.mock.module(initComponent));
  beforeEach(
    angular.mock.inject(
      ($rootScope: IScope, $compile: ICompileService, $state: StateService) => {
        scope = $rootScope.$new();
        state = $state;
        render = () => $compile("<init></init>")(scope);
        jest.spyOn(firebase, "auth").mockImplementation(() => ({
          onAuthStateChanged: onChange,
        }));
        onChange.mockImplementation(() => jest.fn());
      },
    ),
  );

  it("displays a loading message", () => {
    const element = render();

    expect(element.find(".loading")[0].outerHTML).toMatchSnapshot();
  });

  describe("when firebase auth state changes", () => {
    const triggerChange = (authState: any) =>
      onChange.mock.calls[0][0](authState);
    beforeEach(() => {
      jest.spyOn(state, "go");
    });

    it("redirects to the login state if not logged in", () => {
      render();
      triggerChange(null);

      expect(state.go).toHaveBeenCalledTimes(1);
      expect(state.go).toHaveBeenCalledWith("login");
    });

    it("redirects to the employees list if logged in", () => {
      render();
      triggerChange({});

      expect(state.go).toHaveBeenCalledTimes(1);
      expect(state.go).toHaveBeenCalledWith("employees");
    });
  });

  describe("when destroyed", () => {
    it("unsubscribes from the auth state change event", () => {
      const unsubscribeStub = jest.fn();
      onChange.mockImplementation(() => unsubscribeStub);
      render();

      scope.$destroy();

      expect(unsubscribeStub).toHaveBeenCalledTimes(1);
    });
  });
});
