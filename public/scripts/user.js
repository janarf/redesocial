  function setUser(response, database, name, email, imgURL = "https://image.flaticon.com/icons/svg/145/145866.svg") {
    database.ref('users/' + response.user.uid).set({
      username: name,
      email: email,
      imgURL: imgURL
    })
  }