// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$("#friend-link").click(() => {
  window.location = `../pages/friends.html?id=${USER_ID}`;
})

$("#profile").click((e) => {
  console.log('perfil')
  window.location = `../pages/profile.html?id=${USER_ID}`;
})

$(document).ready(function () {
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
              setKeyToComment(key)
              addComment(key)
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
        <p data-text-id="${key}" id="text-post-${key}">${text}</p>
        <input data-text-input="${key}" class="edit-hidden" value=${text} id="edit-${key}">
        </div>
      </div>
    </div>
    <hr>
  <div>
    <input type="image" data-like=${key} value=${likeCount} src="../img/cookie.ico" height=25 weight=25>&nbsp<span>${likeCount}</span>&nbsp;&nbsp

    <input data-comment="${key}" type="image" value=${comment} src="../img/icons/balloongreen.png" height=25 weigth= 25>&nbsp;&nbsp
    <button data-key="${key}" type="button" id="delete-button-${key}" > Excluir </button>
    <button data-edit="${key}" type="button"  id="edit-button-${key}"> Editar</button>
    <button type="button" data-save="${key}" class="edit-hidden" id="save-button-${key}"> Salvar </button>
   

    <input data-comment-btn="${key}" type="image" value=${comment} src="../img/icons/balloongreen.png" height=25 weigth= 25>&nbsp;&nbsp
    

  </div>
  <hr>
  <div>
    <p><strong>Comentários</strong></p>
    <div class="comment-list" data-area=${key}></div>
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

    document.getElementById(`edit-${key}`).className = "";
    document.getElementById(`text-post-${key}`).className = "edit-hidden";
    document.getElementById(`save-button-${key}`).className = "";
    document.getElementById(`delete-button-${key}`).className = "edit-hidden";
    document.getElementById(`edit-button-${key}`).className = "edit-hidden";
   

   
  })
  $(`button[data-save=${key}]`).click(function (){
    let newText = document.getElementById(`edit-${key}`).value;
    document.getElementById(`text-post-${key}`).innerHTML = newText;

    document.getElementById(`edit-${key}`).className = "edit-hidden";
    document.getElementById(`text-post-${key}`).className = "";
    document.getElementById(`save-button-${key}`).className = "edit-hidden";
    document.getElementById(`delete-button-${key}`).className = "";
    document.getElementById(`edit-button-${key}`).className = "";

    database.ref(`posts/${USER_ID}/${key}`).update({
      post: newText
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

function comment(username, text, key) {
  database.ref('comments/' + key).push({
    name: username,
    comment: text,
  })
}

function addComment(key) {
  database.ref("comments/" + key).once("value")
    .then(function (snapshot) {
      const temp = snapshot.val();
      snapshot.forEach(function (childSnapshot) {
        const commentKey = childSnapshot.key;
        $(`div[data-area=${key}]`).append(`
        <div class="container mt-4 p-4 bg-light">
          <div class="container">
            <div class="row">
              <div class="col-2 col-md-1 m-0 p-0">
                <figure class="background--gray rounded-circle profile-picture">
                  <img class="w-100 rounded-circle margin-0" src="../img/icons/girl.png" alt="">
                </figure>
              </div>
              <div class="col-9 col-md-10 float-right text--gray text--big">
                <p><strong>${temp[commentKey].name}</strong></p>
                <p>${temp[commentKey].comment}</p>
              </div>
            </div>
          </div>
        </div>
        `)
      });
    })
}

function setKeyToComment(key) {
  let username = "";
  database.ref("users/" + USER_ID).once('value')
    .then(function (snapshot) {
      username = snapshot.val().username;
  });
  $(`input[data-comment-btn=${key}]`).click(function () {
    event.preventDefault();
    $(`[data-div=${key}]`).append(`
    <div id="comment-area" class="text-right">
      <hr>
      <textarea data-comment=${key} class="form-control border-0  mb-0 w-100 bg-light" rows="1"}"></textarea>
      <button type="button" data-submit=${key} class="btn-xs border-0 btn--green rounded">Comentar</button>
    </div> 
    `)
    $(`button[data-submit=${key}]`).click(function () {
      let text = $(`textarea[data-comment=${key}]`).val()
      comment(username, text, key);
      $("#comment-area").remove();
      $(`div[data-area=${key}]`).find("div").remove();
      addComment(key);
    })
  })

}