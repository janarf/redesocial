$(document).ready(() => {

  $('#sign-in-google-btn').on('click', (e) => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(result)
    });

  })
})