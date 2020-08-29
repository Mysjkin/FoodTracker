import firebase from "./firebase";
import "firebase/auth";
import "firebase/firestore";

const FirebaseLogin = async (email, password) => {
    var credential = {};
    await firebase
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

const FirebaseSignup = async (username, email, password) => {
    var credential = {};
    await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((firebaseCredential) => {
            firebase.auth().currentUser.updateProfile({
                displayName: username
            });
            credential = firebaseCredential;
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