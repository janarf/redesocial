var config = {
  apiKey: "AIzaSyCfgtjBifK9PdxZr7IWrq2jlnpb2KXqInM ",
  authDomain: "tutorial-getninja.firebaseapp.com ",
  databaseURL: "https://tutorial-getninja.firebaseio.com ",
  projectId: "tutorial-getninja ",
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true })

//teste