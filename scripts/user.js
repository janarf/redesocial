  function setUser(response, database, name) {
    database.ref('users/' + response.user.uid).set({
      username: name
    })

  }