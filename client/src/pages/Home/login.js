let characterEntered = false;
let passwordEntered = false;
let userRecentCommands = [];

function showHideInput() {
    var x = document.getElementById("inputBar");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


//log to chatbox
function logThis(text) {
    $("#anchor").before(`<p class="displayed-message">${text}</p>`);
    updateScroll();
}

//Scrolling
function updateScroll() {
    $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)
}

//LOG IN
function userLogin() {
    logThis("Welcome to the Inn At The Edge of Copyright!");
    logThis(" ")
    logThis(" ")
    logThis("Please enter you character name, or type 'sign up' if you don't have a character.");
}

//assign value to characterEntered or start character creation
function getCharacterName(value) {
    if (value.toLowerCase() === "sign up") {
        // console.log("ok!");
        location.href = "/newPlayer";
    } else {
        characterEntered = value;
        logThis("Please enter your password: ")
    }
}

//interpret user text
$("#submit-button").click(function (event) {
    event.preventDefault();

    //log, then clear input value
    let value = $(".chat-input").val();
    // console.log(value);
    $(".chat-input").val("");
    userRecentCommands.push(value);

    if (!(characterEntered)) {
        getCharacterName(value);
        showHideInput();
    } else if (!(passwordEntered)) {
        passwordEntered = value;
        loginPlayer(characterEntered, passwordEntered);
        showHideInput();
    } else {
        if (value.toLowerCase() === "yes" || value.toLowerCase() === "y") {
            passwordEntered = false;
            characterEntered = false;
            userLogin();
        }
    }
});



//PAGE INIT

userLogin();