// Get a reference to the database service
const database = firebase.database();
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function() {
  database.ref("posts/" + USER_ID).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      if (childData.post) {
        $(".post-list").prepend(`<li>${childData.post}</li>`)
      };

    });
  });

  $(".post-text-btn").click(function(event) {
    event.preventDefault();

    let text = $(".post-input").val();

    if (text === "") {
      $(".post-text-btn").on(function() {
        $(this).prop("disabled", true);
      });
    } else {
      post(text, database, USER_ID);

      $(".post-list").prepend(templateStringPost(text));
      $(".post-input").val("");
    };
  });
});

function templateStringPost(text) {
  return `<div><p>${text}</p></div>`
}