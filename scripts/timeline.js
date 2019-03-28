$(document).ready(function(){
  
    $(".post-text-btn").click(function(event){
        const text = $(".post-input").val();
        if(text === ""){
            $(".post-text-btn").on(function() {
                $(this).prop("disabled",true);
            });
        } else{
        $(".post-list").prepend(`<li><h1>${text}</h1></li>`)
        $(".post-input").val("");
        };
    });
});