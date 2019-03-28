$(document).ready(() => {

  $('#sign-up-btn').on('click', (e) => {
    e.preventDefault();
    let name = $('#input-name').val();
    let email = $('#input-email').val();
    let password = $('#input-password').val();

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((response) => {
        response.user.updateProfile({ displayName: name });
        console.log(response.user)
      })
      .catch(function(error) {
        alert(error.message);
        console.log(error);
      })
  });


  $('#sign-in-btn').on('click', (e) => {
    e.preventDefault();
    let email = $('#login-email').val();
    let password = $('#login-password').val();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response.user)
      })
      .catch(function(error) {
        alert(error.message);
        console.log(error);
      })
  });
});