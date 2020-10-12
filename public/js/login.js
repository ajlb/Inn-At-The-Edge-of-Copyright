let characterEntered = false;
let userRecentCommands = [];


//log to chatbox
function logThis(text) {
    $("#anchor").before(`<p class="displayed-message">${text}</p>`);
    updateScroll();
}

//Scrolling
function updateScroll(){
    $(".message-output-box").scrollTop($(".message-output-box")[0].scrollHeight)  
}

//LOG IN
function userLogin(){
    logThis("Welcome to the Inn At The Edge of Copyright!");
    logThis(" ")
    logThis(" ")
    logThis("Please enter you character name, or type 'sign up' if you don't have a character.");
}

//assign value to characterEntered or start character creation
function getCharacterName(value){
    if (value.toLowerCase() === "sign up"){
        createCharacter();
    } else {
        characterEntered = value;
        logThis("Please enter your password: ")
    }
}





$("#submit-button").click(function(event) {
    event.preventDefault();

    //log, then clear input value
    let value = $(".chat-input").val();
    console.log(value);
    $(".chat-input").val("");
    userRecentCommands.push(value);

    if (!(characterEntered)){
        getCharacterName(value);
    } else {
        loginPlayer(characterEntered, value)
    } 
});
  
  

//PAGE INIT

userLogin();