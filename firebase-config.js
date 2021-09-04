import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA0dmUhicosrp3IfkJPWf8gl5H9oUVXFyQ",
    authDomain: "whatsapp2-c2b37.firebaseapp.com",
    projectId: "whatsapp2-c2b37",
    storageBucket: "whatsapp2-c2b37.appspot.com",
    messagingSenderId: "506458203081",
    appId: "1:506458203081:web:26d2fb06fd154efc857e18"
};

const app = !firebase?.apps?.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app()


const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }