// Get a reference to the database service
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];
$(document).ready(function() {
  database.ref("posts/").once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      let childKey = childSnapshot.key;
      let childData = childSnapshot.val();
      if (childData.post && childData.user === USER_ID) {
        database.ref("users/" + USER_ID).once('value').then(function(snapshot) {
          const username = snapshot.val().username;
          $(".post-list").prepend(templateStringPost(childData.post, username))
        });
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
      database.ref("users/" + USER_ID).once('value').then(function(snapshot) {
        const username = snapshot.val().username;
        $(".post-list").prepend(templateStringPost(text, username))
      })
      $(".post-input").val("");
    };
  });
});

function userName(userId) {
  return database.ref("users/" + userId).once('value').then(function(snapshot) {
    return snapshot.val().username
  });
}

function templateStringPost(text, username) {
  let templateString = `<div><strong>${username}</strong><div><p>${text}</p></div></div>`

  return templateString

}