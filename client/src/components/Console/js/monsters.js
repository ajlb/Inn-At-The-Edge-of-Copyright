function attackCreature(socket, user, location, input){
    console.log(`${user.characterName} wants to attack ${input} from:`);
    console.log(location.current.fightables[0]);
}

export {
    attackCreature
}