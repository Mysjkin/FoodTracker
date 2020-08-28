import firebase from "./firebase";
import "firebase/auth";
import "firebase/firestore";

const FirebaseLogin = (email, password) => {
    let credential = {};
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(firebaseCredential => {
            credential = firebaseCredential;
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        })
    return credential;
}

const FirebaseLogout = () => {

}

const FirebaseSignup = (username, email, password) => {
    let credential = {};
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((firebaseCredential) => {
            credential = firebaseCredential
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        })
    return credential;
}

export {
    FirebaseLogin,
    FirebaseLogout,
    FirebaseSignup
}