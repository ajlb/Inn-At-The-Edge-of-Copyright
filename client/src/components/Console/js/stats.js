import setChatHistory from '../ChatPanel'


function showStats(user) {
    console.log(user)
const statsArray = [];

for (const param in user.stats) {

  statsArray.push(`${user.stats[param]}`);

    // does user go here?
    statsArray.forEach((user) => {
      
    
    setChatHistory(prevState => [...prevState, { type: 'displayed-stat', text: user}]);
})
}
};


export  {
    showStats
}