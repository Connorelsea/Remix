import firebase from "firebase"

const config = {
  apiKey: "AIzaSyBzVrdIRwfgGs9No4SoEUO3KlxO9zyVjDQ",
  authDomain: "remix-app.firebaseapp.com",
  databaseURL: "https://remix-app.firebaseio.com",
  projectId: "remix-app",
  storageBucket: "remix-app.appspot.com",
  messagingSenderId: "1052885322267",
}

firebase.initializeApp(config)

export const ref = firebase.database()
export const firebaseAuth = firebase.auth

export function loginUser(email, password) {
  return firebaseAuth().signInWithEmailAndPassword(email, password)
}
