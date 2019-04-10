$("#friend-link").click(() => {
  window.location = `../pages/friends.html?id=${USER_ID}`;
})

$("#profile").click((e) => {
  window.location = `../pages/profile.html?id=${USER_ID}`;
})

$("#timeline-link").click((e) => {
  window.location = `../pages/timeline.html?id=${USER_ID}`;
})