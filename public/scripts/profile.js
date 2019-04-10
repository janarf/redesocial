$(document).ready(function() {
  $('.file-select').on('change', handleFileUploadChange);
  $('.file-submit').on('click', handleFileUploadSubmit);
  let selectedFile;
  setProfileDiv()

  function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
    $('.custom-file-label').html(selectedFile.name);
  }

  function handleFileUploadSubmit(e) {
    storageRef.child(`images/${USER_ID}/profilePicture`)
      .put(selectedFile).then(
        storageRef.child(`images/${USER_ID}/profilePicture`)
        .getDownloadURL()
        .then(snapshot => {
          updatePhoto(snapshot);
          database.ref("users/" + USER_ID)
            .once('value')
            .then(function(snapshot) {

              const name = snapshot.val().username;
              const imgURL = snapshot.val().imgURL;
              $('.profile-info').html(templateProfile(name, imgURL))
            })
        })
      )

    $('.custom-file-label').html('Escolher foto');
  }

  function setProfileDiv() {
    database.ref("users/" + USER_ID)
      .once('value')
      .then(function(snapshot) {

        const name = snapshot.val().username;
        const imgURL = snapshot.val().imgURL;
        $('.profile-info').html(templateProfile(name, imgURL))
      })
  }

  function templateProfile(name, imgURL) {
    return `<figure class="background--gray rounded-circle w-25 d-inline-block ">
            <img class="w-100 rounded-circle margin-0" src="${imgURL}" alt="">
          </figure>
<div class="d-inline-block text--gray p-2">
          <p class="text-wrap" >${name}</p>
          </div>`
  }
})

function updatePhoto(newImg) {
  database.ref(`users/${USER_ID}`).update({
    imgURL: newImg
  });
}