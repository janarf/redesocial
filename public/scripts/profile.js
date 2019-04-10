const storage = firebase.storage();
const storageRef = storage.ref()
console.log(USER_ID)
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
      .put(selectedFile)
    storageRef.child(`images/${USER_ID}/profilePicture`)
      .getDownloadURL()
      .then(snapshot => {
        updatePhoto(snapshot);
        setProfileDiv()
      })


    $('.custom-file-label').html('Escolher foto');
  }

  function setProfileDiv() {
    console.log('entrou')
    database.ref("users/" + USER_ID)
      .once('value')
      .then(function(snapshot) {

        const name = snapshot.val().username;
        const imgURL = snapshot.val().imgURL;
        console.log(name, imgURL)
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