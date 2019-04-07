const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

document.getElementById("timeline-link").addEventListener("click", function () {
    window.location = `../pages/timeline.html?id=${USER_ID}`;
})

$(document).ready(() => {

    database.ref("users").once("value")
        .then(function (snapshot) {
            const users = snapshot.val();
            snapshot.forEach(function (childSnapshot) {
                const key = childSnapshot.key;
                suggestion(users[key].username, key)
            });
        })
});

function suggestion(name, key) {
    if (key !== USER_ID) {
        $("#suggestion-list").append(`
        <li>
            <span>${name}</span>
            <button data-friend-id=${key}>Seguir</button>
        </li>
        `)
    }
    $(`button[data-friend-id=${key}]`).click(function() {
        database.ref("friendship/" + USER_ID).push({
            friendId: key
        })
    })
}

