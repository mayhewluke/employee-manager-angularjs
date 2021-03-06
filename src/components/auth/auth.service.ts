import angular from "angular";

import firebase from "firebase/app";
import "firebase/auth";

export class AuthService {
  /* @ngInject */
  constructor(private $q: ng.IQService) {}

  public isAuthenticated() {
    return firebase.auth().currentUser !== null;
  }

  public logIn(
    email: string,
    password: string,
  ): ng.IPromise<firebase.auth.UserCredential> {
    return this.$q.resolve(
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(() =>
          firebase.auth().createUserWithEmailAndPassword(email, password),
        ),
    );
  }
}

export const authServiceModule = angular
  .module("auth.service", [])
  .service("AuthService", AuthService).name;
