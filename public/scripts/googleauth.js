$(document).ready(() => {
  $('#sign-in-google-btn').on('click', (e) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(response) {
      setUser(response, database, response.user.displayName)


      window.location = `../pages/timeline.html?id=${response.user.uid}`;
    });
  });
});