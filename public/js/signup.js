// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {
    var signUpForm = $("form.signup");
    var checkIfPlayerAvailable = $("#validate")
    var emailInput = $("input#Email");
    var passwordInput = $("input#Password");
    var characterName = $("input#PlayerName")

    signUpForm.on("click", function (event) {
        event.preventDefault();

    })

    checkIfPlayerAvailable.on("click", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var newPlayer = {
            player_name: characterName.val().trim(),
        };

        if (!newPlayer.player_name){
            return;
        }

        // if we have a characterName, run the checker function
        checkIfAvailable(newPlayer.player_name);

    });

    function checkIfAvailable (characterName) {
        return new Promise( function (resolve, reject) {
            $.get("/api/validate/" + characterName, function(data){
                handleResponse(data);
            })
        })
        
        // // Send the POST request.
        // $.ajax("/api/checker", {
        //     type: "POST",
        //     data: newPlayer
        // }).then(
        //     function () {
        //         console.log("created new sandwich");
        //         // Reload the page to get the updated list
        //         location.reload();
        //     }
        // );
    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }

    function handleResponse(msg){
        if (msg === "Taken") {
            $("#alert .msg").text("That Character Name is Taken Please try again");
            $("#alert").show();
            characterName.val("");
        } else if (msg === "Available"){
            $("#alert .msg").text("That Name is Available");
            $("#alert").show();
            $("#continueSignUp").show();
        } else {
            // something is wrong
            console.log('hmmm something went wrong')
        }
        
    }
});
