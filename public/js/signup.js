// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {
    var signUpForm = $("#submit-button");
    var validateButton = $("#validate")
    // var emailInput = $("input#Email");
    var passwordInput = $("input#Password");
    var verifyNewPass = $("input#Verify")
    var characterName = $("input#PlayerName");
    var playerValidate = false;
    let wis, dex, str, hp;

    // Dice roller functionality
    function getRandomInt (max) {
        return Math.floor(Math.random() * max)
    }

    signUpForm.on("click", function (event) {
        event.preventDefault();
        if (playerValidate === false) {
            location.href = "/newPlayer";//reload this page
        } else {
            makePlayer();
        }
    });

    validateButton.on("click", function (event) {
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

    function roll (dice) {
        let sum = 0

        dice.forEach(die => {
            for (let i = 0; i < die[0]; i++) {
                sum += getRandomInt(die[1]) + 1
            }
        })
        return sum
    }

    function generateBaseStats () {
        wis = roll([[4,6]]);//roll 4d6  
        dex = roll([[4,6]]);//roll 4d6  
        str = roll([[4,6]]);//roll 4d6  
        hp = roll([[4,6]]);//roll 4d6

        return {wis, dex, str, hp}
    }

    function makePlayer () {
        
        if (passwordInput.val() !== verifyNewPass.val()) {
            console.log(passwordInput.val());
            handleResponse ("Bad Pass");
        } else {
            var stats = generateBaseStats();
            var name = characterName.val().trim();
            var pass = passwordInput.val().trim();
            var race = "human";
            var profession = "accountant";
            console.log(stats);
            signupPlayer(name, pass, stats, race, profession)

        }

    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }

    function handleResponse(msg){
        if (msg === "Taken") {
            $("#alert .msg").text("That Character Name is Taken Please try again");
            $("#alert").toggleClass("alert-danger");
            $("#alert").show();
            characterName.val("");
        } else if (msg === "Available"){
            playerValidate = true;
            $("#alert .msg").text("That Name is Available");
            $("#alert").toggleClass("alert-success")
            $("#alert").show();
            $("#continueSignUp").show();
        } else if (msg === "Bad Pass") {
            $("#passalert .msg").text("The passwords don't match. Try again.");
            $("#passalert").toggleClass("alert-danger");
            $("#passalert").show();
            verifyNewPass.val("");
            passwordInput.val("");
        } else {
            // something is wrong
            console.log('hmmm something went wrong')
            console.log(msg);
        }
        
    }
});
