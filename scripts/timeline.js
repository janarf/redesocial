// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  loadTimeline();
  $('.select-public-private-timeline').change(loadTimeline)

  function loadTimeline() {
    database.ref("posts/" + USER_ID)
      .on('value', () => {
        setPublicOrPrivateTimeline($('.select-public-private-timeline'))
          .once('value')
          .then((snapshot) => {
            const posts = snapshot.val()
            $(".post-list").html("")

            if (!posts) return;

            Object.keys(posts).forEach(key => {
              database.ref("users/" + USER_ID)
                .once('value')
                .then(function(snapshot) {
                  const name = snapshot.val().username;
                  $(".post-list").append(templateStringPost(posts[key].post, name, key))
                  setKeyToButton(key)
                })
            })
          })
      })
  }

  $(".post-text-btn").click(function(event) {
    event.preventDefault();
    let text = $(".post-input").val();
    if (text === "") {
      $(".post-text-btn").on(function() {
        $(this).prop("disabled", true);
      });
    } else {
      post(text, database, USER_ID, setPublicOrPrivatePost($(".select-public-private")));

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

function setPublicOrPrivatePost(event) {
  if (event.val() === 'public') {
    return false
  } else {
    return true
  }
}

function setPublicOrPrivateTimeline(event) {
  if (event.val() === 'public') {
    return database.ref("posts/" + USER_ID).orderByChild("privado").equalTo(false)
  } else {
    return database.ref("posts/" + USER_ID)
  }
}