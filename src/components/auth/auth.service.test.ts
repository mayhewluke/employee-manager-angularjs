jest.mock("firebase");

import angular, { IScope } from "angular";
import "angular-mocks";
import firebase from "firebase";

import { AuthService, authServiceModule } from "./auth.service";

describe("auth service", () => {
  let auth: AuthService;
  beforeEach(angular.mock.module(authServiceModule));
  beforeEach(
    // tslint:disable-next-line:variable-name
    angular.mock.inject((_AuthService_: AuthService) => {
      auth = _AuthService_;
    }),
  );

  describe("logIn", () => {
    const email = "user@example.com";
    const password = "somethingsecret";
    const mockSignIn = jest.fn();
    const mockCreate = jest.fn();
    const authReturn: Partial<firebase.auth.Auth> = {
      createUserWithEmailAndPassword: mockCreate,
      signInWithEmailAndPassword: mockSignIn,
    };
    let scope: IScope;
    beforeEach(
      angular.mock.inject(($rootScope: IScope) => {
        scope = $rootScope;
        (firebase.auth as any).mockImplementation(() => authReturn);
      }),
    );

    it("tries to log in to firebase with the email and password", async () => {
      mockSignIn.mockImplementation(() => Promise.resolve());

      process.nextTick(() => scope.$apply());
      await auth.logIn(email, password);

      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith(email, password);
    });

    describe("when logging in succeeds", () => {
      const loginResponse = "Success!";
      beforeEach(() => {
        mockSignIn.mockImplementation(() => Promise.resolve(loginResponse));
      });

      it("resolves the promise with the firebase response", async () => {
        process.nextTick(() => scope.$apply());
        await expect(auth.logIn(email, password)).resolves.toEqual(
          loginResponse,
        );
      });
    });

    describe("when logging in fails", () => {
      beforeEach(() => {
        mockSignIn.mockImplementation(() => Promise.reject());
      });

      it("tries to create a user with the email and password", async () => {
        process.nextTick(() => scope.$apply());
        await auth.logIn(email, password);

        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate).toHaveBeenCalledWith(email, password);
      });

      describe("when account creation succeeds", () => {
        const createResponse = "Creation succeeded!";
        beforeEach(() => {
          mockCreate.mockImplementation(() => Promise.resolve(createResponse));
        });

        it("resolves the promise with the firebase response", async () => {
          process.nextTick(() => scope.$apply());
          await expect(auth.logIn(email, password)).resolves.toEqual(
            createResponse,
          );
        });
      });

      describe("when account creation fails", () => {
        const error = new Error("Creation failed!");
        beforeEach(() => {
          mockCreate.mockImplementation(() => Promise.reject(error));
        });

        it("rejects the promise with the firebase response", async () => {
          process.nextTick(() => scope.$apply());
          await expect(auth.logIn(email, password)).rejects.toEqual(error);
        });
      });
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when logged in", () => {
      (firebase.auth as any).mockImplementation(() => ({ currentUser: {} }));

      expect(auth.isAuthenticated()).toBe(true);
    });

    it("returns true when not logged in", () => {
      (firebase.auth as any).mockImplementation(() => ({ currentUser: null }));

      expect(auth.isAuthenticated()).toBe(false);
    });
  });
});
