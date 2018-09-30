jest.mock("firebase");

import firebase from "firebase";

import { logIn } from "./auth.service";

describe("auth service", () => {
  describe("logIn", () => {
    const email = "user@example.com";
    const password = "somethingsecret";
    const mockSignIn = jest.fn();
    const mockCreate = jest.fn();
    const authReturn: Partial<firebase.auth.Auth> = {
      createUserWithEmailAndPassword: mockCreate,
      signInWithEmailAndPassword: mockSignIn,
    };
    beforeEach(() => {
      (firebase.auth as any).mockImplementation(() => authReturn);
    });

    it("tries to log in to firebase with the email and password", async () => {
      mockSignIn.mockImplementation(() => Promise.resolve());

      await logIn(email, password);

      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith(email, password);
    });

    describe("when logging in succeeds", () => {
      const loginResponse = "Success!";
      beforeEach(() => {
        mockSignIn.mockImplementation(() => Promise.resolve(loginResponse));
      });

      it("resolves the promise with the firebase response", async () => {
        await expect(logIn(email, password)).resolves.toEqual(loginResponse);
      });
    });

    describe("when logging in fails", () => {
      beforeEach(() => {
        mockSignIn.mockImplementation(() => Promise.reject());
      });

      it("tries to create a user with the email and password", async () => {
        await logIn(email, password);

        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate).toHaveBeenCalledWith(email, password);
      });

      describe("when account creation succeeds", () => {
        const createResponse = "Creation succeeded!";
        beforeEach(() => {
          mockCreate.mockImplementation(() => Promise.resolve(createResponse));
        });

        it("resolves the promise with the firebase response", async () => {
          await expect(logIn(email, password)).resolves.toEqual(createResponse);
        });
      });

      describe("when account creation fails", () => {
        const error = new Error("Creation failed!");
        beforeEach(() => {
          mockCreate.mockImplementation(() => Promise.reject(error));
        });

        it("rejects the promise with the firebase response", async () => {
          await expect(logIn(email, password)).rejects.toEqual(error);
        });
      });
    });
  });
});
