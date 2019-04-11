$(document).ready(function () {
  setProfileDiv()

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
      .put(selectedFile)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then(
          snapshot => {
            updatePhoto(snapshot);
          }
        )
        storageRef.child(`images/${USER_ID}/profilePicture`)
          .getDownloadURL()
          .then(snapshot => {
            updatePhoto(snapshot);
            console.log()
            database.ref("users/" + USER_ID)
              .once('value')
              .then(function (snapshot) {
                const name = snapshot.val().username;
                const imgURL = snapshot.val().imgURL;
                const email = snapshot.val().email;
                $('.profile-info').html(templateProfile(name, email, imgURL));
              })
          })
      })
    $('.custom-file-label').html('Escolher foto');
  }

  function setProfileDiv() {
    database.ref("users/" + USER_ID)
      .once('value')
      .then(function (snapshot) {
        const name = snapshot.val().username;
        const imgURL = snapshot.val().imgURL;
        const email = snapshot.val().email;
        $('.profile-info').html(templateProfile(name, email, imgURL))
      })
  }

  function templateProfile(name, email, imgURL) {
    return `<figure class="background--gray rounded-circle d-inline-block profile-picture--big">
            <img class="rounded-circle margin-0 profile-picture--big" src="${imgURL}" alt="">
          </figure>
<div class="d-inline-block text--gray p-2 ">
          <p class="text-wrap pt-2" >${name}</p>
          <p><small>${email}</small></p>
          </div>`
  }
});

function updatePhoto(newImg) {
  database.ref(`users/${USER_ID}`).update({
    imgURL: newImg
  });
}