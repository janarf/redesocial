// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  database.ref("posts/" + USER_ID).on('value', function(snapshot) {
    const posts = snapshot.val()
    $(".post-list").html("")

    if (!posts) return;

    Object.keys(posts).forEach(key => {
      database.ref("users/" + USER_ID).once('value').then(function(snapshot) {
        const name = snapshot.val().username;
        $(".post-list").append(templateStringPost(posts[key].post, name, key))
        setKeyToButton(key)
      })
    })
  })


  $(".post-text-btn").click(function(event) {
    event.preventDefault();
    let text = $(".post-input").val();
    if (text === "") {
      $(".post-text-btn").on(function() {
        $(this).prop("disabled", true);
      });
    } else {
      post(text, database, USER_ID);
      $(".post-input").val("");
      $(".post-list").html("")

    };
  });
});

function templateStringPost(text, name, key) {
  return `<div>
  <p><strong>${name}</strong></p>
  <p>${text}</p>
  <button data-key="${key}" type="button" class="delete"> Excluir </button>
  </div>`
}

function setKeyToButton(key) {
  $(`button[data-key=${key}]`).click(function() {
    $(this).parent().remove();
    database.ref(`posts/${USER_ID}/${key}`).remove();
  })
}

// function setPublicOrPrivatePost() {
//   if ($(".select-public-private").val() === 'private') {
//     return false
//   } else {
//     return true
//   }