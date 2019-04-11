$(document).ready(() => {
  $('#sign-in-google-btn').on('click', (e) => {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (response) {
      setUser(response, database, response.user.displayName, response.user.email, response.user.photoURL)
      window.location = `../pages/timeline.html?id=${response.user.uid}`;
    });
  });
});