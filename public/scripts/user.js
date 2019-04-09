  function setUser(response, database, name, email, imgURL) {
    database.ref('users/' + response.user.uid).set({
      username: name,
      email: email,
      // imgURL:
    })
  }