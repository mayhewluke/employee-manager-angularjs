import angular from "angular";
import firebase from "firebase/app";

import { rootModule } from "root";
import firebaseConfigJson from "secrets/firebaseConfig.json";

firebase.initializeApp(firebaseConfigJson);
angular.bootstrap(document, [rootModule]);
