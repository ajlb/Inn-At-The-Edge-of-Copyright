import { startSession } from "mongoose";

//import setChatHistory from '../ChatPanel'
const paramNames = {
    DEX: 'Dexterity',
    WIS: 'Wisdom',
    STR: 'Strength',
    CHA: 'Charisma',
    HP: 'HP',
}


function showStats(user, setChatHistory) {
    console.log(user)
    const statsArray = [];

    statsArray.push(`\xa0\xa0\xa0`);
    statsArray.push(`You are a level ${user.stats.level} ${user.race} ${user.profession}.`);
    statsArray.push(`You have ${user.stats.XP} experience.`);
    statsArray.push(`\xa0\xa0\xa0`);

    for (const param in user.stats) {
        if (Object.keys(paramNames).includes(param)){
            if (param === "HP"){
                let color;
                let HP = user.stats.HP;
                let max = user.stats.maxHP;
                if (HP === max){
                    color = "text-success";
                } else if (HP < 5){
                    color = "text-danger";
                } else {
                    color = "text-warning";
                }
                statsArray.push(`${paramNames[param]}:  <span className='${color}'>${Math.floor(user.stats[param])}</span>/${Math.floor(user.stats.maxHP)}`);
            } else {
                if (user.stats[param] === user.stats["max"+param]){
                    statsArray.push(`${paramNames[param]}:  <span className='displayed-cyan'>${Math.floor(user.stats[param])}</span> - You have reached the maximum level of ${paramNames[param]}`);
                } else {
                    statsArray.push(`${paramNames[param]}:  ${Math.floor(user.stats[param])}`);
                }
            }
        }
    }

    // const deletedItems = statsArray.slice(0, 4);
    // const newDeletedItems = statsArray.slice(8, 10);

    // const newArray = deletedItems.concat(newDeletedItems)

    statsArray.forEach((user) => {

   
      //  let currentColor = 'display-stat';
       // if (newArray[3] < 5)


     //       const userDisplay = { type: currentColor, text: `${user}` }

        setChatHistory(prevState => [...prevState, { type: 'display-stat', text: `${user}`}]);
      //  console.log(redSpan);

    });

}
export {
    showStats
}