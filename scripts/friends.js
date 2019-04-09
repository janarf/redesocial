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
                suggestion(users[key].username, key);
                friendList(users[key].username, key);
            });
        })
});

function suggestion(name, key) {
    database.ref("friendship/" + USER_ID).orderByChild("friendId").equalTo(key).once("value", snapshot => {
        if (!snapshot.exists()) {
            if (key !== USER_ID) {
                $("#suggestion-list").append(`  
                <li id=${key + "suggestion"}>
                    <div class="container border border-light bg-light">
                        <div class="row align-items-center justify-content-around">
                            <div class="col-2 p-2 ml-n4">
                                <figure class="background--gray rounded-circle profile-picture">
                                    <img class="w-100 rounded-circle margin-0" src="../img/icons/girl.png" alt="">
                                </figure>
                            </div>
                            <div class="col-6 ml-n4">
                                <span class="text-sm-left text-nowrap">${name}</span>
                            </div>    
                            <div class="col-3 mr-n4">
                                <button class="btn-xs border-0 btn--green rounded" data-friend-id=${key}><img class="margin-0 btn-icon" src="../img/icons/addfriend.png"></button>
                            </div>
                        </div>    
                    </div>
                </li>
                `)
            }
            $(`button[data-friend-id=${key}]`).click(function () {
                database.ref("friendship/" + USER_ID).push({
                    friendId: key
                })
                $('#' + key + "suggestion").remove();
                friendList(name, key);
            })
        }
    });
}

function friendList(name, key) {
    database.ref("friendship/" + USER_ID).orderByChild("friendId").equalTo(key).once("value", snapshot => {
        if (snapshot.exists()) {
            if (key !== USER_ID) {
                $("#friend-list").append(`  
                <li id=${key}>
                    <div class="container border border-light bg-light">
                        <div class="row align-items-center justify-content-around">
                            <div class="col-2 p-2 ml-n4">
                                <figure class="background--gray rounded-circle profile-picture">
                                    <img class="w-100 rounded-circle margin-0" src="../img/icons/girl.png" alt="">
                                </figure>
                            </div>
                            <div class="col-6 ml-n4">
                                <span class="text-sm-left text-nowrap">${name}</span>
                            </div>    
                            <div class="col-3 mr-n4">
                                <button class="btn-xs border-0 btn--green rounded" data-friend-id=${key}><img class="margin-0 btn-icon" src="../img/icons/deletefriend.png"></button>
                            </div>
                        </div>    
                    </div>
                </li>
                `)
            }
            $(`button[data-friend-id=${key}]`).click(function () {
                database.ref("friendship/" + USER_ID).once("value")
                    .then(function (snapshot) {
                        const temp = snapshot.val();
                        snapshot.forEach(function (childSnapshot) {
                            const friendKey = childSnapshot.key;
                            if (key == temp[friendKey].friendId) {
                                database.ref(`friendship/${USER_ID}/${friendKey}`).remove();
                                suggestion(name, key);
                            }
                        });
                    })
                $('#' + key).remove();
            })
        }
    });
}

function search(email) {
    // database.ref("users").orderByChild("email").equalTo(email).once("value", snapshot => {
    database.ref("users").once("value")
        .then(function (snapshot) {
            const temp = snapshot.val();
            let notFound = true;
            snapshot.forEach(function (childSnapshot) {
                const friendKey = childSnapshot.key;
                if (email === temp[friendKey].email) {
                    notFound = false;
                    database.ref("friendship/" + USER_ID).orderByChild("friendId").equalTo(friendKey).once("value", snapshot => {
                        if (!snapshot.exists()) {
                            $("#search").append(`  
                            <li id=${friendKey + "search"}>
                                <div class="container border border-light bg-light">
                                    <div class="row align-items-center justify-content-around">
                                        <div class="col-2 p-2 ml-n4">
                                            <figure class="background--gray rounded-circle profile-picture">
                                                <img class="w-100 rounded-circle margin-0" src="../img/icons/girl.png" alt="">
                                            </figure>
                                        </div>
                                        <div class="col-6 ml-n4">
                                            <span class="text-sm-left text-nowrap">${temp[friendKey].username}</span>
                                        </div>
                                        <div class="col-3 mr-n4">
                                            <button class="btn-xs border-0 btn--green rounded" data-friend-id=${friendKey}><img class="margin-0 btn-icon" src="../img/icons/addfriend.png"></button>
                                        </div>
                                    </div>    
                                </div>    
                            </li>
                            `)
                            $(`button[data-friend-id=${friendKey}]`).click(function () {
                                database.ref("friendship/" + USER_ID).push({
                                    friendId: friendKey
                                })
                                $('#' + friendKey + "search").remove();
                                friendList(temp[friendKey].username, friendKey);
                                $('#' + friendKey + "suggestion").remove();
                            })
                        } else {
                            $("#search").append(`  
                                <li>
                                    <span>Usuária já está na lista de amigas!</span>
                                </li>
                            `)
                        }
                    });
                }
            });
            if (notFound) {
                $("#search").append(`  
            <li>
                <span>Usuária não encontrada!</span>
            </li>
            `)
            }
        });
}

document.getElementById("friend-search-btn").addEventListener("click", function () {
    let inputName = $("#friend-search").val();
    $("#search").find("li").remove();
    search(inputName);
})