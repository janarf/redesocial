$(document).ready(() => {
  function post(text, database, USER_ID) {
    database.ref('posts/' + USER_ID).push({
      post: text,
      likeCount: 0,
    })

  }
})