$(document).ready(() => {
  $("#sign-in-fb-btn").click(function() {
    // e.preventDefault()
    let provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      setUser(result, database, result.user.displayName, result.user.photoURL)
      window.location = `../pages/timeline.html?id=${result.user.uid}`
    }).catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      // ...
    });
  })
});