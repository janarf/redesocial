// Get a reference to the database service
const database = firebase.database();


$(document).ready(function(){
    database.ref("posts").once('value').then(function(snapshot) {
       snapshot.forEach(function(childSnapshot){
           let childKey = childSnapshot.key;
           let childData = childSnapshot.val();
           if (childData.post){
             $(".post-list").prepend(`<li>${childData.post}</li>`)
           };

       });
    });
  
    $(".post-text-btn").click(function(event){
        event.preventDefault();

        let text = $(".post-input").val();

        if(text === ""){
            $(".post-text-btn").on(function() {
                $(this).prop("disabled",true);
            });
        } else{

            database.ref('posts/').push({
                post: text
            });
            
            $(".post-list").prepend(`<li>${text}</li>`)
            $(".post-input").val("");

            
          
        };
    });
}); 