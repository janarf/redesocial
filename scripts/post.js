function post(text, database, USER_ID) {
  database.ref('posts/').push({
    post: text,
    likeCount: 0,
    user: USER_ID
  })

}