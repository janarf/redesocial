// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];


$(document).ready(function () {
  database.ref("posts/" + USER_ID).on('value', function(snapshot) {
    const posts = snapshot.val()
    $(".post-list").html("")

    if (!posts) return;

    Object.keys(posts).forEach(key => {
      database.ref("users/" + USER_ID).once('value').then(function (snapshot) {
        const name = snapshot.val().username;
        $(".post-list").append(templateStringPost(posts[key].post, name, key, posts[key].likeCount))
        setKeyToButton(key)
        setKeyToLike(key);
      })
    })
  })


  $(".post-text-btn").click(function (event) {
    event.preventDefault();
    let text = $(".post-input").val();
    if (text === "") {
      $(".post-text-btn").on(function () {
        $(this).prop("disabled", true);
      });
    } else {
      post(text, database, USER_ID);
      $(".post-input").val("");
      $(".post-list").html("")

    };
  });
});

function templateStringPost(text, name, key, likeCount) {
  return `<div>
  <p><strong>${name}</strong></p>
  <p>${text}</p>
  <button type="button" data-like=${key} value=${likeCount}><img src="../img/cookie.ico">&nbsp;&nbsp<span>${likeCount}</span></button>&nbsp;&nbsp  
  <button data-key="${key}" type="button" class="delete"> Excluir </button>
  </div>`
}

function setKeyToButton(key) {
  $(`button[data-key=${key}]`).click(function () {
    $(this).parent().remove();
    database.ref(`posts/${USER_ID}/${key}`).remove();
  })
}

function setKeyToLike(key) {
  $(`button[data-like=${key}]`).click(function () {
    event.preventDefault();
    let likeNum = parseInt($(`button[data-like=${key}]`).val()) + 1;
    database.ref(`posts/${USER_ID}/${key}`).update({likeCount: likeNum});
  });
}

// function setPublicOrPrivatePost() {
//   if ($(".select-public-private").val() === 'private') {
//     return false
//   } else {
//     return true
//   }