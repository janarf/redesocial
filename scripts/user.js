  function setUser(response, database, name, email) {
    database.ref('users/' + response.user.uid).set({
      username: name,
      email: email
    })

  }