import pluralize from "pluralize";
import { allTheSame } from "../../../clientUtilities/finders";

function chooseEnemyAndReturnFightables(socket, user, location, input) {
    try {
        console.log(location);
        const locationEnemies = location.current.fightables;
        console.log(locationEnemies);
        const potentialArray = [];
        for (const enemyNum in locationEnemies) {
            if (locationEnemies[enemyNum].name.toLowerCase() === input) {
                socket.emit('attackCreature', { target: locationEnemies[enemyNum], user, location: location.current });
                return true;
            } else if (locationEnemies[enemyNum].name.toLowerCase().includes(input.toLowerCase())) {
                potentialArray.push(locationEnemies[enemyNum]);
            }
        }
        if (potentialArray.length === 1) {
            socket.emit('attackCreature', { target: potentialArray[0], user, location: location.current });
        } else if (potentialArray.length === 0) {
            socket.emit('failure', `There don't seem to be any ${pluralize(input, 2)} here to fight.`);
        } else if (potentialArray.length > 1) {
            if (allTheSame(potentialArray.map(el => el.name))) {
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