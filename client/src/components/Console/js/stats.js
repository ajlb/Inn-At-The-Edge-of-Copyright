//import setChatHistory from '../ChatPanel'


function showStats(user, setChatHistory) {
    console.log(user)
    const statsArray = [];

    for (const param in user.stats) {

        statsArray.push(`${param}:  ${user.stats[param]}`);
    }

    const deletedItems = statsArray.slice(0, 4);
    const newDeletedItems = statsArray.slice(8, 10);

    const newArray = deletedItems.concat(newDeletedItems)


    newArray.forEach((user) => {
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