// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];
const storage = firebase.storage();
const storageRef = storage.ref();

$(document).ready(function() {
  postInput();
  setAside();
  setProfilePicture();
  setAsideFriends();
  loadTimeline();
  $('.select-public-private-timeline').change(() => {
    $('.post-list').html('')
    loadTimeline();
  })

  function loadTimeline() {
    setPublicOrPrivateTimeline($('.select-public-private-timeline'))
      .once('value')
      .then((snapshot) => {
        const posts = snapshot.val();
        if (!posts) return;
        $('.post-list').html('');
        Object.keys(posts).forEach(key => {
          database.ref(`users/${USER_ID}`)
            .once('value')
            .then((snapshot) => {
              const name = snapshot.val().username;
              const imgURL = snapshot.val().imgURL;
              $('.post-list')
                .append(templateStringPost(posts[key].post, name, key, posts[key].likeCount, imgURL));
              setKeyToLike(key);
              setKeyToEdit(key);
              setKeyToDelete(key);
              setKeyToComment(key);
              addComment(imgURL, key);
            })
        })
      })
  }

  function postInput() {
    $('.post-input').click(() => {
      $('.post-input').val('');
    })
  }

  $('.post-text-btn').click((event) => {
    event.preventDefault();
    let text = $('.post-input').val();
    if (text === '' || text === 'Pegue seu biscoito') {
      $('.post-text-btn').on(() => {
        $(this).prop('disabled', true);
      });
    } else {
      $('.post-list').html('');
      post(text, database, USER_ID, setPublicOrPrivatePost($('.select-public-private')));
      loadTimeline();
      $('.post-input').val('Pegue seu biscoito');
      postInput();
      $('.select-public-private').val('public');
    };
  });

  function post(text, database, USER_ID, private = false) {
    database.ref(`posts/${USER_ID}`)
      .push({
        post: text,
        likeCount: 0,
        privado: private,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
  }

  function templateStringPost(text, name, key, likeCount, imgURL) {
    let content = '';
    if (text.substring(0, 38) === 'https://firebasestorage.googleapis.com') {
      content = `
      <div class= "container-fluid w-100">
        <img data-text-id="${key}" id="text-post-${key}" class="w-100" src=${text} />
      </div>`
    } else {
      content = `<p data-text-id="${key}" id="text-post-${key}">${text}</p>`
    }
    return `
  <div data-div=${key} class="container mt-4 p-4 bg-light">
    <div class="container">
      <div class="row">
        <div class="col-2 col-md-1 m-0 p-0">
          <figure class="background--gray rounded-circle profile-picture">
            <img class="w-100 rounded-circle margin-0  profile-picture" src="${imgURL}" alt="">
          </figure>
        </div>
        <div class="col-9 col-md-10 text--gray text--big">
        <div class="text-right mr-n5">
          <input data-edit="${key}" type="image"  id="edit-button-${key}" src="../img/icons/pencil-edit-button.png" placeholder="Editar" height=20 weigth=20>&nbsp;&nbsp
          <input data-key="${key}" type="image" id="delete-button-${key}"  data-toggle="modal" data-target="#exampleModalCenter" src="../img/icons/rubbish-bin.png" placeholder="Excluir" height=20 weigth=20>&nbsp;&nbsp
        </div>
          <p><strong>${name}</strong></p>
        ${content}
          <input data-text-input="${key}" class="d-none" value=${text} id="edit-${key}">
        </div>
      </div>
    </div>
    <div>
      <input type="image" data-like=${key} value=${likeCount} src="../img/cookie.ico" height=25 weight=25>&nbsp<span data-like-span=${key}>${likeCount}</span>&nbsp;&nbsp
      <input data-comment-btn="${key}" type="image" value=${comment} src="../img/icons/balloongreen.png" height=25 weight= 25>&nbsp;&nbsp
      <button type="button" data-save=${key} class="btn-xs border-0 btn--green font-weight-bold rounded text-white d-none " id="save-button-${key}" > Salvar </button>
    </div>
    <hr>
    <div>
      <p class="text--gray"><strong>Comentários</strong></p>
    <div class="comment-list" data-area=${key}></div>
  </div>
</div>`
  }

  function setKeyToEdit(key) {
    $(`input[data-edit=${key}]`).click(() => {
      $(`#edit-${key}`).removeClass('d-none');
      $(`#text-post-${key}`).addClass('d-none');
      $(`#save-button-${key}`).removeClass('d-none');
      $(`#delete-button-${key}`).addClass('d-none');
      $(`#edit-button-${key}`).addClass('d-none');
    })
    $(`button[data-save=${key}]`).click(() => {
      let newText = document.getElementById(`edit-${key}`).value;
      document.getElementById(`text-post-${key}`).innerHTML = newText;
      $(`#edit-${key}`).addClass('d-none');
      $(`#text-post-${key}`).removeClass('d-none');
      $(`#save-button-${key}`).addClass('d-none');
      $(`#delete-button-${key}`).removeClass('d-none');
      $(`#edit-button-${key}`).removeClass('d-none');
      database.ref(`posts/${USER_ID}/${key}`).update({
        post: newText
      })
    })
  }

  function setKeyToDelete(key) {
    $(`input[data-key=${key}]`).click(function() {
      let deletePost = document.getElementById("delete-modal");
      if (deletePost) {
        $('#delete-modal').click(() => {
          $(`[data-div=${key}]`).remove();
          $('.post-input').val('');
          database.ref(`posts/${USER_ID}/${key}`).remove();
          database.ref(`comments/${key}`).remove();
          $('#exampleModalCenter').modal('hide');
        })
      } else {
        event.preventDefault();
      }
    });
  }

  function setPublicOrPrivatePost(event) {
    if (event.val() === 'public') {
      return false;
    } else {
      return true;
    };
  }

  function setPublicOrPrivateTimeline(event) {
    if (event.val() === 'public') {
      $('.post-list').html('');
      return database.ref(`posts/${USER_ID}`).orderByChild('privado').equalTo(false);
    } else {
      $('.post-list').html('')
      return database.ref(`posts/${USER_ID}`);
    }
  }

  function setKeyToLike(key) {
    $(`input[data-like=${key}]`).click(() => {
      event.preventDefault();
      let likeNum = parseInt($(`input[data-like=${key}]`).val()) + 1;
      $(`span[data-like-span=${key}]`).html(likeNum);
      database.ref(`posts/${USER_ID}/${key}`).update({ likeCount: likeNum });
    });
  }

  function setAside() {
    database.ref(`users/${USER_ID}`)
      .once('value')
      .then((snapshot) => {
        const name = snapshot.val().username;
        const email = snapshot.val().email;
        const imgURL = snapshot.val().imgURL;
        $('.aside-container').html(`
      <div class= "row mr-2">
              <figure class="background--gray rounded-circle profile-picture">
                <img class="w-100 rounded-circle margin-0 profile-picture" src="${imgURL}" alt="">
              </figure>
              <div class="text--gray pl-2">
              <p class="mb-0 mt-2">
              ${name}
              </p>
              <p>
              <small>${email}</small>
              </p>
              </div>
              </div>
            `);
      });
  };

  function setProfilePicture() {
    database.ref("users/" + USER_ID)
      .once('value')
      .then((snapshot) => {
        const imgURL = snapshot.val().imgURL;
        $("#timeline-profile-picture").html(`<img class="w-100 rounded-circle margin-0 profile-picture" src="${imgURL}" alt="">`)
      })
  }

  function setAsideFriends() {
    database.ref(`friendship/${USER_ID}`)
      .once('value')
      .then((snapshot) => {
        const friends = snapshot.val();
        if (!friends) return;
        Object.keys(friends).forEach((friendKey) => {
          database.ref(`users/${friends[friendKey].friendId}`)
            .once('value')
            .then((snapshot) => {
              let friend = snapshot.val();
              $('.images-Friends').append(templateFriends(friend.imgURL, friend.username));
            })
        })
      })
  }

  function templateFriends(imgURL, name) {
    return `
    <img class="rounded-circle profile-picture" src="${imgURL}" title="${name}"alt="">
  `
  }

  function comment(username, text, key) {
    database.ref(`comments/${key}`).push({
      name: username,
      comment: text,
    })
  }

  function addComment(profilePic, key) {
    $('#comment-area').remove();
    database.ref(`comments/${key}`).once('value')
      .then((snapshot) => {
        const temp = snapshot.val();
        snapshot.forEach(function(childSnapshot) {
          const commentKey = childSnapshot.key;
          $(`div[data-area=${key}]`).append(`
        <div class="container mt-4 p-4 bg-light">
          <div class="container">
            <div class="row">
              <div class="col-2 col-md-1 m-0 p-0">
                <figure class="background--gray rounded-circle profile-picture">
                  <img class="w-100 rounded-circle margin-0 profile-picture" src="${profilePic}" alt="">
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
    let username = '';
    let profilePic = '';
    database.ref(`users/${USER_ID}`).once('value')
      .then((snapshot) => {
        username = snapshot.val().username;
        profilePic = snapshot.val().imgURL;
      });
    $(`input[data-comment-btn=${key}]`).click(() => {
      event.preventDefault();
      $(`[data-div=${key}]`).append(`
    <div id="comment-area" class="text-right">
      <hr>
      <textarea data-comment=${key} class="form-control border-0  mb-0 w-100 bg-light" rows="1" placeholder="Dê um biscoito"></textarea>
      <button type="button" data-submit=${key} class="btn-xs border-0 btn--green font-weight-bold rounded text-white">Comentar</button>
    </div>
    `)
      $(`button[data-submit=${key}]`).click(() => {
        let text = $(`textarea[data-comment=${key}]`).val()
        comment(username, text, key);
        $('#comment-area').remove();
        $(`div[data-area=${key}]`).find('div').remove();
        addComment(profilePic, key);
      })
    })
  }

  $('#insert-img').click(() => {
    $('.file-select')[0].click();
    $('.post-text-btn').hide();
    $('.post-img-btn').removeClass('d-none');
  })

  $('.file-select').on('change', handleFileUploadChange);
  $('.post-img-btn').on('click', handleFileUploadSubmit);
  let selectedFile;

  function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
    $('.post-input').html(selectedFile.name);
  }

  function handleFileUploadSubmit(e) {
    e.preventDefault()
    storageRef.child(`images/${USER_ID}/posts/${selectedFile.name}`)
      .put(selectedFile)
      .then((file) => {
        file.ref.getDownloadURL()
          .then(snapshot => {
            post(snapshot, database, USER_ID, setPublicOrPrivatePost($(".select-public-private")))
            $('.post-img-btn').addClass("d-none")
            $('.post-text-btn').show()
            $('.post-input').html('Pegue seu biscoito')
            loadTimeline()
          })
      });
  }
})