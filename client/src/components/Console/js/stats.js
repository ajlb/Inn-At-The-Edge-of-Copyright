function showStats(user, setChatHistory){
    const statsArray = [];
    for (const param in user.stats){
        statsArray.push(`${param}: ${user.stats[param]}`);
    }
    statsArray.forEach(stat=>{
        setChatHistory(prevState => [...prevState, {type: 'displayed-indent', text: stat}]);
        
    })
}

module.exports = {
    showStats
}