function post(text, database, USER_ID) {
  database.ref('posts/' + USER_ID).push({
    post: text,
    likeCount: 0,
    user: USER_ID
    //preciso desse id aqui?
  })

}