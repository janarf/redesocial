const config = {
  apiKey: "AIzaSyD7Bdj2Jbfym1PvVtfqtEEp5iAEg6P-hA0",
  authDomain: "redesocial-18fde.firebaseapp.com",
  databaseURL: "https://redesocial-18fde.firebaseio.com",
  projectId: "redesocial-18fde",
  storageBucket: "redesocial-18fde.appspot.com",
  messagingSenderId: "533368476703"
};
firebase.initializeApp(config);

const database = firebase.database();

const storage = firebase.storage();