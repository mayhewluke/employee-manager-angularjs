import firebase from "firebase";

export const logIn = (
  email: string,
  password: string,
): Promise<firebase.auth.UserCredential> =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(() =>
      firebase.auth().createUserWithEmailAndPassword(email, password),
    );
