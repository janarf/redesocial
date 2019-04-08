// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  postInput()
  loadTimeline();
  $('.select-public-private-timeline').change(() => {
    $(".post-list").html("")
    loadTimeline();

  })

  function loadTimeline() {
    setPublicOrPrivateTimeline($('.select-public-private-timeline'))
      .once('value')
      .then((snapshot) => {
        const posts = snapshot.val()
        if (!posts) return;
        $(".post-list").html("")
        Object.keys(posts).forEach(key => {
          database.ref("users/" + USER_ID)
            .once('value')
            .then(function(snapshot) {
              const name = snapshot.val().username;
              $(".post-list").append(templateStringPost(posts[key].post, name, key, posts[key].likeCount))
              setKeyToButton(key)
              setKeyToLike(key)
            })
        })
      })
  }

  function postInput() {
    $(".post-input").click(function(event) {
      $(".post-input").val("")
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
      $(".post-list").html("")

      post(text, database, USER_ID, setPublicOrPrivatePost($(".select-public-private")));
      loadTimeline()
      $(".post-input").val('Pegue seu biscoito');
      postInput()
      $(".select-public-private").val("public")
    };
  });
});


function post(text, database, USER_ID, private = false) {
  database.ref('posts/' + USER_ID).push({
    post: text,
    likeCount: 0,
    privado: private,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  })
}


function templateStringPost(text, name, key, likeCount = 0) {
  return `
<div data-div=${key} class="container mt-4 p-4 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-2 col-md-1 m-0 p-0">
          <figure class="background--gray rounded-circle profile-picture">
            <img class="w-100 rounded-circle margin-0" src="../img/icons/girl.png" alt="">
          </figure>
        </div>
        <div class="col-9 col-md-10 float-right">
        <p><strong>${name}</strong></p>
        <p>${text}</p>
        </div>
      </div>
    </div>
    <hr>

<div>
  <button type="button" data-like=${key} value=${likeCount}><img src="../img/cookie.ico">&nbsp;&nbsp<span>${likeCount}</span></button>&nbsp;&nbsp
  <button data-key="${key}" type="button" class="delete"> Excluir </button>
  </div>
  </div>`
}

function setKeyToButton(key) {
  $(`[data-div=${key}]`).click(function() {
    $(this).remove();
    $(".post-input").val("Pegue seu biscoito");
    postInput();
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
    $(".post-list").html("")
    return database.ref("posts/" + USER_ID).orderByChild("privado").equalTo(false)
  } else {
    $(".post-list").html("")
    return database.ref("posts/" + USER_ID)
  }
}

function setKeyToLike(key) {
  $(`button[data-like=${key}]`).click(function() {
    event.preventDefault();
    let likeNum = parseInt($(`button[data-like=${key}]`).val()) + 1;
    $(`button[data-like=${key}] > span`).html(likeNum);
    database.ref(`posts/${USER_ID}/${key}`).update({ likeCount: likeNum });
  });
}

document.getElementById("friend-link").addEventListener("click", function() {
  window.location = `../pages/friends.html?id=${USER_ID}`;
})