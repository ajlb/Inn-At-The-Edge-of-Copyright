function loginPlayer(characterName, password) {
    console.log("You're in loginPlayer");
    $.post("/login", { characterName: characterName, password: password }).then(function (data) {
        window.location.replace("/play");
    }).catch(e => {
        console.log(e);
        window.location.replace("/play")
    });
}