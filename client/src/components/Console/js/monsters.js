import pluralize from "pluralize";
import { allTheSame } from "../../../clientUtilities/finders";


//give player XP on win, maybe an item
//let players die
//let players revive
//let players fight each other




function chooseEnemyAndReturnFightables(socket, user, location, input) {
    try {
        console.log(location);
        const locationEnemies = location.current.fightables;
        console.log(locationEnemies);
        const potentialArray = [];
        for (const enemyNum in locationEnemies) {
            if (locationEnemies[enemyNum].isAlive) {
                console.log('found a live enemy!');
                if (locationEnemies[enemyNum].name.toLowerCase() === input) {
                    console.log('picked this exact match enemy:');
                    console.log(locationEnemies[enemyNum]);
                    socket.emit('attackCreature', { target: locationEnemies[enemyNum], user, location: location.current });
                    return true;
                } else if (locationEnemies[enemyNum].name.toLowerCase().includes(input.toLowerCase())) {
                    console.log('pushing this enemy into array');
                    potentialArray.push(locationEnemies[enemyNum]);
                }
            }
        }
        if (potentialArray.length === 1) {
            console.log('there was only one match');
            console.log(potentialArray[0]);
            socket.emit('attackCreature', { target: potentialArray[0], user, location: location.current });
        } else if (potentialArray.length === 0) {
            socket.emit('failure', `There don't seem to be any ${pluralize(input, 2)} here to fight.`);
        } else if (potentialArray.length > 1) {
            if (allTheSame(potentialArray.map(el => el.name))) {
                console.log('picked one of many:');
                console.log(potentialArray[0]);
                socket.emit('attackCreature', { target: potentialArray[0], user, location: location.current });

            } else {
                socket.emit('green', `I'm not sure what you want to fight. Maybe one of these? ${potentialArray.map(en => {
                    return en.name;
                }).join(", ")}.`);

            }
        }
    } catch (e) {
        console.log("Error from chooseEnemyAndReturnFightables:");
        console.log(e);
        return false;
    }
}

function attackCreature(socket, user, location, input) {
    try {
        console.log(`${user.characterName} wants to attack ${input} from:`);
        chooseEnemyAndReturnFightables(socket, user, location, input);
    } catch (e) {
        console.log("Error from attackCreature:");
        console.log(e);
    }
}

export {
    attackCreature
}