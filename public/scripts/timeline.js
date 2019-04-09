// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  postInput()
  setAside();
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

              const imgURL = snapshot.val().imgURL;
              $(".post-list").append(templateStringPost(posts[key].post, name, key, posts[key].likeCount, imgURL))
              setKeyToButton(key)

              
              setKeyToLike(key)
              setKeyToEdit(posts[key].post, key)
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


function templateStringPost(text, name, key, likeCount, imgURL) {
  return `
<div data-div=${key} class="container mt-4 p-4 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-2 col-md-1 m-0 p-0">
          <figure class="background--gray rounded-circle profile-picture">
            <img class="w-100 rounded-circle margin-0" src="${imgURL}" alt="">
          </figure>
        </div>
        <div class="col-9 col-md-10 text--gray text--big">
        <p><strong>${name}</strong></p>
        <p data-text-id="${key}">${text}</p>
        </div>
      </div>
    </div>
    <hr>
  <div>
    <input type="image" data-like=${key} value=${likeCount} src="../img/cookie.ico" height=25 weight=25>&nbsp<span>${likeCount}</span>&nbsp;&nbsp
    <input data-comment="${key}" type="image" value=${comment} src="../img/icons/balloongreen.png" height=25 weigth= 25>&nbsp;&nbsp
    <button data-key="${key}" type="button" class="delete"> Excluir </button>
     <button data-edit="${key}" type="button" class="edit"> Editar</button>
  </div>
</div>`
}


    function setKeyToButton(key) {
  $(`button[data-key=${key}]`).click(function() {
    database.ref(`posts/${USER_ID}/${key}`).remove();
    $(`[data-div=${key}]`).remove();
    $(".post-input").val("Pegue seu biscoito");
    postInput();

  })
}

function setKeyToEdit(text, key) {
  $(`button[data-edit=${key}]`).click(function (){
    let editPost = prompt(`Edite o seu post: ${text}`);
    $(`p[data-text-id=${key}]`).html(editPost);
    database.ref(`posts/${USER_ID}/${key}`).update({
      post: editPost
    });
  })

} 



function setKeyToDelete(key) {
  $(`button[data-key=${key}]`).click(function () {
    let deletePost = confirm("Deseja apagar mesmo esse post?");
    if(deletePost){
      $(`[data-div=${key}]`).remove();
      $(".post-input").val("");

      database.ref(`posts/${USER_ID}/${key}`).remove();
    }else{
      event.preventDefault();
    }  

  });
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
  $(`input[data-like=${key}]`).click(function() {
    event.preventDefault();
    let likeNum = parseInt($(`input[data-like=${key}]`).val()) + 1;
    $(`input[data-like=${key}]`).html(likeNum);
    database.ref(`posts/${USER_ID}/${key}`).update({ likeCount: likeNum });
  });
}
$("#friend-link").click(() => {
  window.location = `../pages/friends.html?id=${USER_ID}`;
})

$("#profile").click((e) => {

  console.log('perfil')
  window.location = `../pages/profile.html?id=${USER_ID}`;
})

function setAside() {
  database.ref("users/" + USER_ID)
    .once('value')
    .then(function(snapshot) {
      const name = snapshot.val().username;
      const email = snapshot.val().email;
      const imgURL = snapshot.val().imgURL;
      $(".aside-container").html(`
      <div class= "row mr-2">
              <figure class="background--gray rounded-circle profile-picture">
                <img class="w-100 rounded-circle margin-0 " src="${imgURL}" alt="">
              </figure>
              <div class="text--gray">
              <p class="mb-0 mt-2">
              ${name}
              </p>
              <p>
              ${email}
              </p>
              </div>
              </div>
            `)
    })
}

function comment(text, key) {
  database.ref('comments/' + posts[key]).push({
    comment: text,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  })
}

function templateStringComment(text, name, key, timestamp, imgURL) {
  return `
<div data-div=${key} class="container mt-4 p-4 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-2 col-md-1 m-0 p-0">
          <figure class="background--gray rounded-circle profile-picture">
            <img class="w-100 rounded-circle margin-0" src="${imgURL}" alt="">
          </figure>
        </div>
        <div class="col-9 col-md-10 text--gray">
        <p><strong>${name}</strong></p>
        <p>${text}</p>
        <p>${timestamp}</p>
        </div>
      </div>
    </div>
</div>`
}

templateStringComment();