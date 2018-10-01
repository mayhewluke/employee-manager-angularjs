import { StateService } from "@uirouter/angularjs";
import angular from "angular";
import "angular-mocks";

import { authModule } from ".";
import { AuthService } from "./auth.service";

describe("auth module", () => {
  let auth: AuthService;
  let state: StateService;
  let scope: ng.IScope;
  const protectedState = {
    data: {
      requireAuth: true,
    },
    name: "protected",
    url: "/protected",
  };
  const regularState = {
    name: "regular",
    url: "/regular",
  };
  beforeEach(angular.mock.module(authModule));
  beforeEach(
    // tslint:disable-next-line:no-shadowed-variable
    angular.mock.inject(($rootScope, $state, $stateRegistry, AuthService) => {
      auth = AuthService;
      state = $state;
      scope = $rootScope;
      $stateRegistry.register(protectedState);
      $stateRegistry.register(regularState);
    }),
  );
  describe("when navigating to a state that requires authentication", () => {
    describe("when logged in", () => {
      beforeEach(() => {
        jest.spyOn(auth, "isAuthenticated").mockImplementation(() => true);
      });

      it("allows access to the state", () => {
        state.go(protectedState);
        scope.$apply();

        expect(state.current.name).toEqual(protectedState.name);
      });
    });

    describe("when not logged in", () => {
      beforeEach(() => {
        jest.spyOn(auth, "isAuthenticated").mockImplementation(() => false);
      });

      it("redirects to the login state", () => {
        state.go(protectedState);
        scope.$apply();

        expect(state.current.name).toEqual("login");
      });
    });
  });

  describe("when navigating to a state that does not require authentication", () => {
    it("does not redirect to the login state, even if not logged in", () => {
      jest.spyOn(auth, "isAuthenticated").mockImplementation(() => false);

      state.go(regularState);
      scope.$apply();

      expect(state.current.name).not.toEqual("login");
    });
  });
});
