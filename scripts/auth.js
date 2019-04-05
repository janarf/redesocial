$(document).ready(() => {
  const database = firebase.database();

  $('#sign-up-btn').on('click', (e) => {
    e.preventDefault();
    let name = $('#input-name').val();
    let email = $('#input-email').val();
    let password = $('#input-password').val();

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((response) => {
        response.user.updateProfile({ displayName: name });
        setUser(response, database, name);


        window.location = `../pages/timeline.html?id=${response.user.uid}`;
      })
      .catch(function(error) {
        errorMessageSignUp(error);
      })
  });


  $('#sign-in-btn').on('click', (e) => {
    e.preventDefault();
    let email = $('#login-email').val();
    let password = $('#login-password').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((response) => {
        window.location = `../pages/timeline.html?id=${response.user.uid}`;
      })
      .catch(function(error) {
        errorMessageSignIn(error);
      })
  });

  firebase.auth().signOut().then(function() {
      // INSERIR AQUI REDIRECIONAMENTO LOGOUT
    })
    .catch(function(error) {
      alert(`Erro desconhecido: ${error.code}: ${error.message}`);
    });

  function errorMessageSignUp(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        alert('O endereço de email já está cadastrado.');
        break;
      case 'auth/invalid-email':
        alert('Insira um endereço de email válido.');
        break;
      case 'auth/weak-password':
        alert('A senha deve ter no mínimo 6 caracteres.');
        break;
      default:
        alert(`Erro desconhecido: ${error.code}: ${error.message}`);
        break;
    }
  };

  function errorMessageSignIn(error) {
    switch (error.code) {
      case 'auth/wrong-password':
        alert('Senha inválida.')
        break;
      case 'auth/user-not-found':
        alert('Email não cadastrado.')
        break;
      default:
        alert(`Erro desconhecido: ${error.code}: ${error.message}`);
        break;
    }
  }
});