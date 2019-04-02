$(document).ready(() => {
  function setUser(response, database) {
    database.ref('users/' + response.user.uid).push({
      name: response.user.displayName
    })
  }
})